import { pool, Student, Submission } from './db';
import { normalizeKeyword } from './submission-rules';

export async function getOrCreateStudent(name: string, email: string): Promise<Student> {
  const found = await pool.query<Student>('SELECT * FROM students WHERE lower(email)=lower($1)', [email]);
  if (found.rowCount) {
    const existing = found.rows[0];
    if (existing.name !== name) {
      const updated = await pool.query<Student>('UPDATE students SET name = $1 WHERE id = $2 RETURNING *', [name, existing.id]);
      return updated.rows[0];
    }
    return existing;
  }

  const created = await pool.query<Student>('INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
  return created.rows[0];
}

export async function findStudentById(studentId: string) {
  const student = await pool.query<Student>('SELECT * FROM students WHERE id = $1', [studentId]);
  return student.rows[0] || null;
}

export async function findStudents(search?: string) {
  if (!search?.trim()) {
    const result = await pool.query<Student>('SELECT * FROM students ORDER BY student_number ASC');
    return result.rows;
  }

  const term = `%${search.toLowerCase()}%`;
  const result = await pool.query<Student>(
    'SELECT * FROM students WHERE lower(name) LIKE $1 OR lower(email) LIKE $1 ORDER BY student_number ASC',
    [term]
  );
  return result.rows;
}

export async function getSubmissionsByStudent(studentId: string) {
  const result = await pool.query<Submission>('SELECT * FROM submissions WHERE student_id = $1 ORDER BY created_at DESC', [studentId]);
  return result.rows;
}

export async function createSubmission(studentId: string, keyword: string, htmlCode: string) {
  return pool.query<Submission>('INSERT INTO submissions (student_id, keyword, html_code) VALUES ($1, $2, $3) RETURNING *', [
    studentId,
    normalizeKeyword(keyword),
    htmlCode
  ]);
}

export async function getAllSubmissions() {
  const result = await pool.query<Submission>(
    `SELECT s.*, st.name, st.email, st.student_number
      FROM submissions s
      JOIN students st ON st.id = s.student_id
      ORDER BY s.created_at DESC`
  );
  return result.rows;
}

export async function getStudentsWithSubmissions() {
  const students = await findStudents();
  const submissions = await getAllSubmissions();
  return students.map((student) => ({
    ...student,
    submissions: submissions.filter((submission) => submission.student_id === student.id)
  }));
}

export async function getSystemSettings() {
  const result = await pool.query<{ id: string; site_password: string; admin_email: string | null }>('SELECT * FROM system_settings LIMIT 1');
  return result.rows[0] ?? null;
}

export async function setSitePassword(sitePassword: string) {
  await pool.query('UPDATE system_settings SET site_password = $1 WHERE id = (SELECT id FROM system_settings LIMIT 1)', [sitePassword]);
}

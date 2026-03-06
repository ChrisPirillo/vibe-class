import Link from 'next/link';
import { getStudentsWithSubmissions } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const students = await getStudentsWithSubmissions();
  const keywordMap = new Map<string, { studentId: string; studentName: string; submissionId: string }[]>();

  students.forEach((student) => {
    student.submissions.forEach((submission) => {
      const key = submission.keyword.toLowerCase();
      const prev = keywordMap.get(key) ?? [];
      prev.push({ studentId: student.id, studentName: student.name, submissionId: submission.id });
      keywordMap.set(key, prev);
    });
  });

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Gallery</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-3">
          <h3 className="text-lg font-semibold">Students</h3>
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between border-b border-slate-800 pb-2">
              <p>
                #{student.student_number} {student.name}
              </p>
              <Link className="text-indigo-400" href={`/portfolio/${student.id}`}>
                View work
              </Link>
            </div>
          ))}
        </div>

        <div className="card space-y-3">
          <h3 className="text-lg font-semibold">Keyword Collections</h3>
          {[...keywordMap.entries()].map(([keyword, entries]) => (
            <div key={keyword} className="space-y-1 border-b border-slate-800 pb-2">
              <p className="font-medium capitalize">{keyword}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                {entries.map((entry) => (
                  <Link key={entry.submissionId} className="rounded bg-slate-800 px-2 py-1" href={`/portfolio/${entry.studentId}`}>
                    {entry.studentName}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

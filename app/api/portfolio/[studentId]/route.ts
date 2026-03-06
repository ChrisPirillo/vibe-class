import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { findStudentById, getSubmissionsByStudent } from '@/lib/queries';

export async function GET(_: Request, { params }: { params: { studentId: string } }) {
  const student = await findStudentById(params.studentId);
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const submissions = await getSubmissionsByStudent(student.id);

  const zip = new JSZip();
  submissions.forEach((submission) => zip.file(`${student.name}_${submission.keyword}.html`, submission.html_code));
  const data = await zip.generateAsync({ type: 'uint8array' });

  return new NextResponse(Buffer.from(data), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${student.name}_portfolio.zip"`
    }
  });
}

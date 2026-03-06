import { notFound } from 'next/navigation';
import { findStudentById, getSubmissionsByStudent } from '@/lib/queries';
import { AppFrame } from '@/components/AppFrame';
import { PortfolioDownloadButton } from '@/components/PortfolioDownloadButton';

export default async function PortfolioPage({ params }: { params: { studentId: string } }) {
  const student = await findStudentById(params.studentId);
  if (!student) return notFound();
  const submissions = await getSubmissionsByStudent(student.id);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{student.name}'s Portfolio</h2>
      <PortfolioDownloadButton studentName={student.name.replace(/\s+/g, '_')} submissions={submissions} />
      {submissions.map((submission) => (
        <article className="card space-y-2" key={submission.id}>
          <p className="font-semibold">{submission.keyword}</p>
          <AppFrame htmlCode={submission.html_code} />
        </article>
      ))}
    </section>
  );
}

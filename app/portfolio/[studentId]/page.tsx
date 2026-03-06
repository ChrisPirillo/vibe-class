import { notFound } from 'next/navigation';
import { findStudentById, getSubmissionsByStudent } from '@/lib/queries';
import { AppFrame } from '@/components/AppFrame';
import { PortfolioDownloadButton } from '@/components/PortfolioDownloadButton';
import { getPortfolioStatusMessage } from '@/lib/portfolio-feedback';

export const dynamic = 'force-dynamic';

export default async function PortfolioPage({
  params,
  searchParams
}: {
  params: { studentId: string };
  searchParams: { status?: string };
}) {
  const student = await findStudentById(params.studentId);
  if (!student) return notFound();

  const submissions = await getSubmissionsByStudent(student.id);
  const status = getPortfolioStatusMessage(searchParams.status);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{student.name}&apos;s Portfolio</h2>

      {status && (
        <div className="rounded-lg border border-emerald-700 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">{status.text}</div>
      )}

      <PortfolioDownloadButton studentName={student.name.replace(/\s+/g, '_')} submissions={submissions} />

      {!submissions.length && (
        <div className="card text-sm text-slate-300">
          No submissions yet. Go to <a className="text-indigo-400" href="/submit">Submit</a> to add your first app.
        </div>
      )}

      {submissions.map((submission) => (
        <article className="card space-y-2" key={submission.id}>
          <p className="font-semibold">{submission.keyword}</p>
          <AppFrame htmlCode={submission.html_code} />
        </article>
      ))}
    </section>
  );
}

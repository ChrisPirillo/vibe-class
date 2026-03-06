import { redirect, notFound } from 'next/navigation';
import { getSubmissionById } from '@/lib/queries';
import { getAdminPayloadFromCookies } from '@/lib/netlify-auth';

export const dynamic = 'force-dynamic';

export default async function AdminSubmissionViewPage({ params }: { params: { id: string } }) {
  const admin = await getAdminPayloadFromCookies();
  if (!admin) redirect('/destro');

  const submission = await getSubmissionById(params.id);
  if (!submission) return notFound();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Secure App Viewer</h2>
        <a className="rounded border border-slate-600 px-3 py-2" href="/zartan">
          Back to dashboard
        </a>
      </div>
      <div className="card space-y-2">
        <p className="text-sm text-slate-300">
          {submission.name} ({submission.email}) · {submission.keyword}
        </p>
        <iframe
          className="h-[70vh] w-full rounded border border-slate-700"
          sandbox="allow-scripts"
          srcDoc={submission.html_code}
          title="Admin secure app view"
        />
      </div>
    </section>
  );
}

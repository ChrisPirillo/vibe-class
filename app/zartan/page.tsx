import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { findStudents, getFilteredSubmissions, getSubmissionHistory, getSystemSettings } from '@/lib/queries';
import { getAdminStatusMessage } from '@/lib/admin-feedback';

export default async function ZartanPage({ searchParams }: { searchParams: { q?: string; status?: string } }) {
  const session = await auth();
  if (!session?.user?.email) redirect('/destro');

  const studentSearch = searchParams.q?.trim() || '';
  const submissions = await getFilteredSubmissions(studentSearch);
  const totalStudents = new Set(submissions.map((s) => s.student_id)).size;
  const settings = await getSystemSettings();
  const students = await findStudents(studentSearch);
  const history = await getSubmissionHistory(40);
  const adminStatus = getAdminStatusMessage(searchParams.status);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>



      {adminStatus && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            adminStatus.tone === 'success'
              ? 'border-emerald-700 bg-emerald-950/40 text-emerald-200'
              : 'border-rose-700 bg-rose-950/40 text-rose-200'
          }`}
        >
          {adminStatus.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="card">Students in result set: {totalStudents}</div>
        <div className="card">Submissions in result set: {submissions.length}</div>
      </div>

      <div className="card space-y-3">
        <h3 className="font-semibold">Site Password</h3>
        <p className="text-sm text-slate-400">Current: {settings?.site_password ?? 'Not set'}</p>
        <div className="flex flex-wrap gap-2">
          <form method="POST" action="/api/admin/password" className="flex gap-2">
            <input
              name="sitePassword"
              className="rounded border border-slate-700 bg-slate-950 p-2"
              placeholder="Set new password"
            />
            <button className="rounded bg-indigo-600 px-3">Update</button>
          </form>
          <form method="POST" action="/api/admin/password">
            <input type="hidden" name="generate" value="1" />
            <button className="rounded border border-slate-600 px-3 py-2">Generate Random</button>
          </form>
        </div>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">Student Search</h3>
          <a className="rounded border border-slate-600 px-3 py-2 text-sm" href="/api/apps/bulk">
            Download All ZIP
          </a>
        </div>
        <form className="flex gap-2" method="GET">
          <input
            className="w-full rounded border border-slate-700 bg-slate-950 p-2"
            name="q"
            defaultValue={studentSearch}
            placeholder="Search by name, email, or keyword"
          />
          <button className="rounded bg-indigo-600 px-4 py-2">Search</button>
        </form>
        <div className="grid gap-2 text-sm text-slate-300">
          {students.map((student) => (
            <div key={student.id} className="rounded border border-slate-800 p-2">
              #{student.student_number} {student.name} · {student.email}
            </div>
          ))}
          {!students.length && <p className="text-slate-500">No students match this query.</p>}
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="font-semibold">Submission History</h3>
        <div className="space-y-2 text-xs text-slate-300">
          {history.map((item) => (
            <div key={item.id} className="rounded border border-slate-800 p-2">
              <span className="font-medium uppercase">{item.action}</span> · {item.name} ({item.email}) · {item.keyword}
            </div>
          ))}
          {!history.length && <p className="text-slate-500">No history yet.</p>}
        </div>
      </div>

      <div className="space-y-3">
        {submissions.map((submission) => (
          <article key={submission.id} className="card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">
                {submission.name} - {submission.keyword}
              </p>
              <div className="flex gap-2">
                <a
                  className="rounded border border-slate-600 px-3 py-2"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/zartan/view/${submission.id}`}
                >
                  View
                </a>
                <a className="rounded border border-slate-600 px-3 py-2" href={`/api/apps/${submission.id}?download=1`}>
                  Download
                </a>
                <form method="POST" action={`/api/apps/${submission.id}`}>
                  <input type="hidden" name="_method" value="DELETE" />
                  <button className="rounded bg-rose-600 px-3 py-2">Delete</button>
                </form>
              </div>
            </div>

            <form method="POST" action={`/api/apps/${submission.id}`} className="space-y-2">
              <input
                name="keyword"
                defaultValue={submission.keyword}
                className="w-full rounded border border-slate-700 bg-slate-950 p-2"
              />
              <textarea
                name="htmlCode"
                defaultValue={submission.html_code}
                className="h-32 w-full rounded border border-slate-700 bg-slate-950 p-2 font-mono text-xs"
              />
              <button className="rounded bg-emerald-600 px-3 py-2">Save Changes</button>
            </form>
          </article>
        ))}
        {!submissions.length && <p className="text-slate-500">No submissions found for this query.</p>}
      </div>
    </section>
  );
}

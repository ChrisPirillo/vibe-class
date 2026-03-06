import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { findStudents, getAllSubmissions, getSystemSettings } from '@/lib/queries';

export default async function ZartanPage({ searchParams }: { searchParams: { q?: string } }) {
  const session = await auth();
  if (!session?.user?.email) redirect('/destro');

  const submissions = await getAllSubmissions();
  const totalStudents = new Set(submissions.map((s) => s.student_id)).size;
  const settings = await getSystemSettings();
  const studentSearch = searchParams.q?.trim() || '';
  const students = await findStudents(studentSearch);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="card">Total Students: {totalStudents}</div>
        <div className="card">Total Submissions: {submissions.length}</div>
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
            placeholder="Search by name or email"
          />
          <button className="rounded bg-indigo-600 px-4 py-2">Search</button>
        </form>
        <div className="grid gap-2 text-sm text-slate-300">
          {students.map((student) => (
            <div key={student.id} className="rounded border border-slate-800 p-2">
              #{student.student_number} {student.name} · {student.email}
            </div>
          ))}
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
                <a className="rounded border border-slate-600 px-3 py-2" target="_blank" href={`/api/apps/${submission.id}`}>
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
      </div>
    </section>
  );
}

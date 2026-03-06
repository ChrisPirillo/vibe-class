import { AppFrame } from '@/components/AppFrame';
import { getAllSubmissions } from '@/lib/queries';

export default async function AppsPage({
  searchParams
}: {
  searchParams: { q?: string; keyword?: string };
}) {
  const all = await getAllSubmissions();
  const q = searchParams.q?.trim().toLowerCase() || '';
  const keyword = searchParams.keyword?.trim().toLowerCase() || '';

  const filtered = all.filter((submission) => {
    const matchesQ =
      !q ||
      submission.name?.toLowerCase().includes(q) ||
      submission.email?.toLowerCase().includes(q) ||
      submission.keyword.toLowerCase().includes(q);
    const matchesKeyword = !keyword || submission.keyword.toLowerCase() === keyword;
    return matchesQ && matchesKeyword;
  });

  const keywords = [...new Set(all.map((s) => s.keyword.toLowerCase()))].sort();

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">All Apps</h2>

      <form className="card grid gap-3 md:grid-cols-3" method="GET">
        <input
          defaultValue={searchParams.q || ''}
          name="q"
          placeholder="Search by student, email, or keyword"
          className="rounded border border-slate-700 bg-slate-950 p-2 md:col-span-2"
        />
        <select
          defaultValue={searchParams.keyword || ''}
          name="keyword"
          className="rounded border border-slate-700 bg-slate-950 p-2"
        >
          <option value="">All keywords</option>
          {keywords.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <button className="rounded bg-indigo-600 px-4 py-2 md:col-span-3 md:w-fit" type="submit">
          Apply filters
        </button>
      </form>

      {filtered.map((submission) => (
        <article className="card space-y-2" key={submission.id}>
          <p className="text-sm text-slate-400">
            #{submission.student_number} {submission.name} · {submission.keyword}
          </p>
          <AppFrame htmlCode={submission.html_code} />
        </article>
      ))}

      {!filtered.length && <p className="text-slate-400">No apps found for this filter.</p>}
    </section>
  );
}

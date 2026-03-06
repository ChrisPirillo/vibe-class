import Link from 'next/link';
import { findStudentByEmail } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function PortfolioLookupPage({ searchParams }: { searchParams: { email?: string } }) {
  const email = searchParams.email?.trim() || '';
  const student = email ? await findStudentByEmail(email) : null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Find Your Portfolio</h2>
      <form className="card space-y-3" method="GET">
        <label className="text-sm text-slate-300" htmlFor="email">
          Enter your submission email to find your portfolio.
        </label>
        <input
          id="email"
          name="email"
          defaultValue={email}
          className="w-full rounded border border-slate-700 bg-slate-950 p-2"
          placeholder="student@example.com"
          type="email"
          required
        />
        <button className="rounded bg-indigo-600 px-4 py-2" type="submit">
          Find portfolio
        </button>
      </form>

      {email && !student && <p className="text-sm text-rose-300">No student found for that email yet.</p>}
      {student && (
        <div className="card space-y-2">
          <p>
            Found: #{student.student_number} {student.name}
          </p>
          <Link className="text-indigo-400" href={`/portfolio/${student.id}`}>
            Open portfolio
          </Link>
        </div>
      )}
    </section>
  );
}

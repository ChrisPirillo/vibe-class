import { InstructionsModal } from '@/components/InstructionsModal';
import { PasswordGate } from '@/components/PasswordGate';
import { getSubmitStatusMessage } from '@/lib/submit-feedback';

export default function SubmitPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = getSubmitStatusMessage(searchParams.status);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Submit an App</h2>

      {status && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            status.tone === 'success'
              ? 'border-emerald-700 bg-emerald-950/40 text-emerald-200'
              : 'border-rose-700 bg-rose-950/40 text-rose-200'
          }`}
        >
          {status.text}
        </div>
      )}

      <PasswordGate />
      <form className="card space-y-3" method="POST" action="/api/submit">
        <input className="w-full rounded border border-slate-700 bg-slate-950 p-2" name="name" placeholder="Name" required />
        <input className="w-full rounded border border-slate-700 bg-slate-950 p-2" name="email" placeholder="Email" type="email" required />
        <input className="w-full rounded border border-slate-700 bg-slate-950 p-2" name="keyword" placeholder="Keyword (game, calculator)" required />
        <textarea className="h-48 w-full rounded border border-slate-700 bg-slate-950 p-2" name="htmlCode" placeholder="Paste HTML" required />
        <div className="flex gap-3">
          <button className="rounded bg-indigo-600 px-4 py-2" type="submit">
            Submit App
          </button>
          <InstructionsModal />
        </div>
      </form>
    </section>
  );
}

import { InstructionsModal } from '@/components/InstructionsModal';
import { PasswordGate } from '@/components/PasswordGate';

export default function SubmitPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Submit an App</h2>
      <PasswordGate />
      <form className="card space-y-3" method="POST" action="/api/submit">
        <input className="w-full rounded border border-slate-700 bg-slate-950 p-2" name="name" placeholder="Name" required />
        <input className="w-full rounded border border-slate-700 bg-slate-950 p-2" name="email" placeholder="Email" type="email" required />
        <input className="w-full rounded border border-slate-700 bg-slate-950 p-2" name="keyword" placeholder="Keyword (game, calculator)" required />
        <textarea className="h-48 w-full rounded border border-slate-700 bg-slate-950 p-2" name="htmlCode" placeholder="Paste HTML" required />
        <div className="flex gap-3">
          <button className="rounded bg-indigo-600 px-4 py-2" type="submit">Submit App</button>
          <InstructionsModal />
        </div>
      </form>
    </section>
  );
}

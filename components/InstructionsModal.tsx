'use client';

import { useState } from 'react';

export function InstructionsModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="rounded border border-slate-600 px-3 py-2" onClick={() => setOpen(true)}>
        Conversion Instructions
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-w-xl rounded-xl bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">Gemini Conversion Instructions</h3>
            <p className="mt-3 text-sm text-slate-300">
              Prompt Gemini with: "Convert this app into a safe standalone HTML snippet with inline JS and CSS, no external network calls."
            </p>
            <button className="mt-4 rounded bg-indigo-600 px-4 py-2" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

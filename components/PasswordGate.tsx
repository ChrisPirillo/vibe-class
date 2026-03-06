'use client';

import { useState } from 'react';

export function PasswordGate() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function unlock() {
    setLoading(true);
    setMessage('');

    const response = await fetch('/api/public/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      setMessage('Access granted. Redirecting...');
      window.location.href = '/';
      return;
    }

    setMessage('Invalid password.');
    setLoading(false);
  }

  return (
    <div className="card mt-4 space-y-3">
      <h2 className="text-lg font-semibold">Public Access Password</h2>
      <input
        className="w-full rounded border border-slate-700 bg-slate-950 p-2"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter site password"
      />
      <button className="rounded bg-indigo-600 px-4 py-2 disabled:opacity-60" onClick={unlock} disabled={loading}>
        {loading ? 'Checking...' : 'Unlock'}
      </button>
      {message && <p className="text-sm text-slate-300">{message}</p>}
    </div>
  );
}

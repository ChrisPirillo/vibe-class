'use client';

import { useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

export function IdentityLogin() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    netlifyIdentity.init();

    async function onLogin(user: any) {
      const token = await user?.jwt?.();
      if (!token) return;

      await fetch('/api/auth/netlify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      netlifyIdentity.close();
      window.location.href = '/zartan';
    }

    function onError(err: Error) {
      setMessage(err.message || 'Login failed.');
    }

    netlifyIdentity.on('login', onLogin);
    netlifyIdentity.on('error', onError);

    return () => {
      netlifyIdentity.off('login', onLogin);
      netlifyIdentity.off('error', onError);
    };
  }, []);

  return (
    <div className="space-y-3">
      <button className="rounded bg-indigo-600 px-4 py-2" onClick={() => netlifyIdentity.open('login')}>
        Login with Netlify Identity
      </button>
      {message && <p className="text-sm text-rose-300">{message}</p>}
    </div>
  );
}

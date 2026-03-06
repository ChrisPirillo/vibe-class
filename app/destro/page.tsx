import { IdentityLogin } from '@/components/IdentityLogin';

export default function DestroPage() {
  return (
    <section className="card mx-auto max-w-md text-center">
      <h2 className="text-2xl font-bold">Admin Login</h2>
      <p className="mt-2 text-sm text-slate-300">Use Netlify Identity to sign in with your pre-invited admin account.</p>
      <div className="mt-4">
        <IdentityLogin />
      </div>
    </section>
  );
}

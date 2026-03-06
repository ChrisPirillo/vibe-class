import { signIn } from '@/auth';

export default function DestroPage() {
  return (
    <section className="card mx-auto max-w-md text-center">
      <h2 className="text-2xl font-bold">Admin Login</h2>
      <form
        action={async () => {
          'use server';
          await signIn('google', { redirectTo: '/zartan' });
        }}
        className="mt-4"
      >
        <button className="rounded bg-indigo-600 px-4 py-2">Sign in with Google</button>
      </form>
    </section>
  );
}

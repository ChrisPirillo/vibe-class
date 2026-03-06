import Link from 'next/link';

export function NavBar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold">Vibe Class</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/">Gallery</Link>
          <Link href="/apps">All Apps</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/submit">Submit</Link>
        </div>
      </nav>
    </header>
  );
}

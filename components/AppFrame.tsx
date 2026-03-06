export function AppFrame({ htmlCode }: { htmlCode: string }) {
  return (
    <iframe
      className="h-72 w-full rounded border border-slate-700"
      sandbox="allow-scripts"
      srcDoc={htmlCode}
      title="Student app preview"
    />
  );
}

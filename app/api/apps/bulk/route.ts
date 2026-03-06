import JSZip from 'jszip';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllSubmissions } from '@/lib/queries';

function safeName(input: string) {
  return input.replace(/[^a-z0-9_-]/gi, '_');
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const submissions = await getAllSubmissions();
  const zip = new JSZip();

  submissions.forEach((submission) => {
    zip.file(`${safeName(submission.name || 'student')}_${safeName(submission.keyword)}.html`, submission.html_code);
  });

  const data = await zip.generateAsync({ type: 'uint8array' });
  return new NextResponse(data, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="all_submissions.zip"'
    }
  });
}

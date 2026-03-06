import JSZip from 'jszip';
import { NextResponse } from 'next/server';
import { getAllSubmissions } from '@/lib/queries';
import { safeName } from '@/lib/filename';
import { getAdminPayloadFromCookies } from '@/lib/netlify-auth';

export async function GET() {
  const admin = await getAdminPayloadFromCookies();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const submissions = await getAllSubmissions();
  const zip = new JSZip();

  submissions.forEach((submission) => {
    const filename = `${safeName(submission.name || 'student')}_${submission.student_number}_${safeName(submission.keyword)}.html`;
    zip.file(filename, submission.html_code);
  });

  const data = await zip.generateAsync({ type: 'uint8array' });
  return new NextResponse(data, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="all_submissions.zip"'
    }
  });
}

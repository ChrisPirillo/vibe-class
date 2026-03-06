import { NextResponse } from 'next/server';
import { createSubmission, getOrCreateStudent, getSubmissionsByStudent } from '@/lib/queries';
import { isKeywordDuplicate } from '@/lib/submission-rules';

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const keyword = String(formData.get('keyword') || '').trim();
  const htmlCode = String(formData.get('htmlCode') || '').trim();

  if (!name || !email || !keyword || !htmlCode) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const student = await getOrCreateStudent(name, email);
  const existing = await getSubmissionsByStudent(student.id);

  if (isKeywordDuplicate(existing.map((s) => s.keyword), keyword)) {
    return NextResponse.json({ error: 'Student already has an app for this keyword.' }, { status: 409 });
  }

  try {
    await createSubmission(student.id, keyword, htmlCode);
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Student already has an app for this keyword.' }, { status: 409 });
    }
    throw error;
  }

  return NextResponse.redirect(new URL(`/portfolio/${student.id}`, request.url));
}

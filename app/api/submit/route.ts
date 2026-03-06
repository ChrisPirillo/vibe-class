import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSubmission, getOrCreateStudent, getSubmissionsByStudent } from '@/lib/queries';
import { isKeywordDuplicate } from '@/lib/submission-rules';

const submissionSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  keyword: z.string().min(1),
  htmlCode: z.string().min(3)
});

function redirectToSubmit(request: Request, status: string) {
  const url = new URL('/submit', request.url);
  url.searchParams.set('status', status);
  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const raw = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    keyword: String(formData.get('keyword') || '').trim(),
    htmlCode: String(formData.get('htmlCode') || '').trim()
  };

  if (!raw.name || !raw.email || !raw.keyword || !raw.htmlCode) {
    return redirectToSubmit(request, 'missing_fields');
  }

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    const hasEmailError = parsed.error.issues.some((issue) => issue.path[0] === 'email');
    return redirectToSubmit(request, hasEmailError ? 'invalid_email' : 'missing_fields');
  }

  if (!raw.htmlCode.includes('<') || !raw.htmlCode.includes('>')) {
    return redirectToSubmit(request, 'invalid_html');
  }

  const student = await getOrCreateStudent(raw.name, raw.email);
  const existing = await getSubmissionsByStudent(student.id);

  if (isKeywordDuplicate(existing.map((s) => s.keyword), raw.keyword)) {
    return redirectToSubmit(request, 'duplicate_keyword');
  }

  try {
    await createSubmission(student.id, raw.keyword, raw.htmlCode);
  } catch (error: any) {
    if (error?.code === '23505') {
      return redirectToSubmit(request, 'duplicate_keyword');
    }
    return redirectToSubmit(request, 'unknown_error');
  }

  return NextResponse.redirect(new URL(`/portfolio/${student.id}?status=submitted`, request.url));
}

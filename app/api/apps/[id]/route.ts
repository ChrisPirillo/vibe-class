import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { pool } from '@/lib/db';
import { logSubmissionHistory } from '@/lib/queries';
import { safeName } from '@/lib/filename';
import { normalizeKeyword } from '@/lib/submission-rules';
import { getAdminPayloadFromCookies } from '@/lib/netlify-auth';

async function requireAdmin() {
  const admin = await getAdminPayloadFromCookies();
  return Boolean(admin);
}

function redirectToDashboard(request: Request, status: string) {
  const url = new URL('/zartan', request.url);
  url.searchParams.set('status', status);
  return NextResponse.redirect(url);
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await pool.query(
    `SELECT s.*, st.name, st.student_number FROM submissions s JOIN students st ON st.id = s.student_id WHERE s.id = $1`,
    [params.id]
  );

  const row = result.rows[0];
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const url = new URL(request.url);
  if (url.searchParams.get('download') === '1') {
    const zip = new JSZip();
    const fileBase = `${safeName(row.name)}_${row.student_number}_${safeName(row.keyword)}`;
    zip.file(`${fileBase}.html`, row.html_code);
    const data = await zip.generateAsync({ type: 'uint8array' });
    return new NextResponse(Buffer.from(data), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileBase}.zip"`
      }
    });
  }

  return new NextResponse(row.html_code, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'"
    }
  });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await request.formData();
  const method = String(form.get('_method') || '').toUpperCase();

  const current = await pool.query('SELECT * FROM submissions WHERE id = $1', [params.id]);
  const existing = current.rows[0];
  if (!existing) return redirectToDashboard(request, 'not_found');

  if (method === 'DELETE') {
    await pool.query('DELETE FROM submissions WHERE id = $1', [params.id]);
    await logSubmissionHistory(existing.id, existing.student_id, 'delete', existing.keyword, existing.html_code);
    return redirectToDashboard(request, 'deleted');
  }

  const keyword = String(form.get('keyword') || '').trim();
  const htmlCode = String(form.get('htmlCode') || '').trim();

  if (!keyword || !htmlCode) {
    return redirectToDashboard(request, 'validation_error');
  }

  try {
    await pool.query('UPDATE submissions SET keyword = $1, html_code = $2 WHERE id = $3', [normalizeKeyword(keyword), htmlCode, params.id]);
  } catch (error: any) {
    if (error?.code === '23505') {
      return redirectToDashboard(request, 'duplicate_keyword');
    }
    return redirectToDashboard(request, 'unknown_error');
  }

  await logSubmissionHistory(existing.id, existing.student_id, 'update', normalizeKeyword(keyword), htmlCode);
  return redirectToDashboard(request, 'updated');
}

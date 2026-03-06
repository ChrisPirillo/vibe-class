import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { auth } from '@/auth';
import { pool } from '@/lib/db';

function safeName(input: string) {
  return input.replace(/[^a-z0-9_-]/gi, '_');
}

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user?.email);
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await pool.query(
    `SELECT s.*, st.name FROM submissions s JOIN students st ON st.id = s.student_id WHERE s.id = $1`,
    [params.id]
  );

  const row = result.rows[0];
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const url = new URL(request.url);
  if (url.searchParams.get('download') === '1') {
    const zip = new JSZip();
    const fileBase = `${safeName(row.name)}_${safeName(row.keyword)}`;
    zip.file(`${fileBase}.html`, row.html_code);
    const data = await zip.generateAsync({ type: 'uint8array' });
    return new NextResponse(data, {
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

  if (method === 'DELETE') {
    await pool.query('DELETE FROM submissions WHERE id = $1', [params.id]);
    return NextResponse.redirect(new URL('/zartan', request.url));
  }

  const keyword = String(form.get('keyword') || '').trim();
  const htmlCode = String(form.get('htmlCode') || '').trim();

  if (!keyword || !htmlCode) {
    return NextResponse.json({ error: 'keyword and htmlCode are required' }, { status: 400 });
  }

  await pool.query('UPDATE submissions SET keyword = $1, html_code = $2 WHERE id = $3', [keyword.toLowerCase(), htmlCode, params.id]);
  return NextResponse.redirect(new URL('/zartan', request.url));
}

# Vibe Class Submission + Portfolio System

Production-ready Next.js App Router project for submission, gallery browsing, student portfolios, and admin management on Netlify.

## Stack
- Next.js 14 (App Router) + Tailwind CSS
- Auth.js / NextAuth.js with Google OAuth
- Netlify Postgres (`pg`) + Auth Postgres adapter (`@auth/pg-adapter`)
- `jszip`, `file-saver`, `js-cookie`
- Vitest + React Testing Library + Playwright

## Environment Variables (configure in Netlify UI)
- `POSTGRES_URL`
- `NEXTAUTH_URL`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Database Setup
```bash
psql "$POSTGRES_URL" -f db/setup.sql
```

## Run
```bash
npm install
npm run dev
```

## Test
```bash
npm run test
npm run test:e2e
```

## Product Highlights
- Public pages (`/`, `/apps`, `/submit`, `/portfolio/[studentId]`) are site-password protected.
- Password unlock uses a secure server endpoint (`/api/public/access`) and a 90-day HTTP-only cookie.
- Admin login at `/destro`; first successful Google login is permanently locked as admin.
- Admin dashboard at `/zartan` includes stats, student/submission search filtering, submission editing/deletion, secure sandboxed app viewing in new tabs, individual ZIP download, intelligent bulk ZIP download naming (`Name_StudentNumber_Keyword`), and submission history tracking.
- Student submissions enforce one app per student per keyword (case-insensitive), with create/update/delete history persisted in `submission_history`.
- Student app rendering is sandboxed via `<iframe sandbox="allow-scripts">`.

## Exact File Structure
```text
app/
  api/
    admin/password/route.ts
    apps/[id]/route.ts
    apps/bulk/route.ts
    auth/[...nextauth]/route.ts
    portfolio/[studentId]/route.ts
    public/access/route.ts
    submit/route.ts
  apps/page.tsx
  destro/page.tsx
  portfolio/page.tsx
  portfolio/[studentId]/page.tsx
  submit/page.tsx
  zartan/page.tsx
  zartan/view/[id]/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  AppFrame.tsx
  InstructionsModal.tsx
  NavBar.tsx
  PasswordGate.tsx
  PortfolioDownloadButton.tsx
db/setup.sql
lib/
  db.ts
  filename.ts
  queries.ts
  submission-rules.ts
auth.ts
middleware.ts
tests/
  components/
  e2e/
  unit/
playwright.config.ts
vitest.config.ts
```

# Vibe Class Submission + Portfolio System

Production-ready Next.js App Router project for submission, gallery browsing, student portfolios, and admin management on Netlify.

## Stack
- Next.js 14 (App Router) + Tailwind CSS
- Netlify Identity (`netlify-identity-widget`) for admin authentication
- Netlify Postgres (`pg`)
- `jszip`, `file-saver`, `js-cookie`
- Vitest + React Testing Library + Playwright

## Environment Variables (configure in Netlify UI)
- `POSTGRES_URL`
- `NETLIFY_IDENTITY_JWT_SECRET` (or `JWT_SECRET` fallback)

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
- Public pages (`/`, `/apps`, `/submit`, `/portfolio/[studentId]`) are site-password protected, and submit form failures/success now show status banners via redirect query params, and successful submit redirects show confirmation on portfolio pages.
- Password unlock uses a secure server endpoint (`/api/public/access`) and a 90-day HTTP-only cookie.
- Admin login at `/destro` uses Netlify Identity widget (manual invite/admin provisioning via Netlify GUI).
- Middleware validates Netlify Identity JWT for `/zartan` protection and admin bypass of public password gating.
- Admin dashboard at `/zartan` includes stats, student/submission search filtering, submission editing/deletion with status feedback banners, secure sandboxed app viewing in new tabs, individual ZIP download, intelligent bulk ZIP download naming (`Name_StudentNumber_Keyword`), and submission history tracking.
- Student submissions enforce one app per student per keyword (case-insensitive), with create/update/delete history persisted in `submission_history`.
- Student app rendering is sandboxed via `<iframe sandbox="allow-scripts">`.

## Exact File Structure
```text
app/
  api/
    admin/password/route.ts
    apps/[id]/route.ts
    apps/bulk/route.ts
    auth/netlify-session/route.ts
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
  IdentityLogin.tsx
  InstructionsModal.tsx
  NavBar.tsx
  PasswordGate.tsx
  PortfolioDownloadButton.tsx
db/setup.sql
lib/
  admin-feedback.ts
  db.ts
  filename.ts
  netlify-auth.ts
  portfolio-feedback.ts
  queries.ts
  submission-rules.ts
  submit-feedback.ts
middleware.ts
tests/
  components/
  e2e/
  unit/
playwright.config.ts
vitest.config.ts
```

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  html_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS submissions_student_keyword_unique
ON submissions (student_id, lower(keyword));

CREATE TABLE IF NOT EXISTS submission_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  keyword TEXT NOT NULL,
  html_code TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS submission_history_changed_at_idx
ON submission_history (changed_at DESC);

CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_password TEXT NOT NULL DEFAULT 'changeme',
  admin_email TEXT
);

INSERT INTO system_settings (site_password)
SELECT 'changeme'
WHERE NOT EXISTS (SELECT 1 FROM system_settings);

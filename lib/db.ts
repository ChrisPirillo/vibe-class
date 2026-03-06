import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export type Student = {
  id: string;
  student_number: number;
  name: string;
  email: string;
};

export type Submission = {
  id: string;
  student_id: string;
  keyword: string;
  html_code: string;
  created_at: string;
  name?: string;
  email?: string;
  student_number?: number;
};

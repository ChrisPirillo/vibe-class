import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import PostgresAdapter from '@auth/pg-adapter';
import { Pool } from 'pg';

const authPool = new Pool({ connectionString: process.env.POSTGRES_URL });

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(authPool),
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      await authPool.query("INSERT INTO system_settings (site_password) SELECT 'changeme' WHERE NOT EXISTS (SELECT 1 FROM system_settings)");

      const result = await authPool.query('SELECT id, admin_email FROM system_settings LIMIT 1');
      const row = result.rows[0];
      const adminEmail = row?.admin_email?.toLowerCase();

      if (!adminEmail) {
        await authPool.query('UPDATE system_settings SET admin_email = $1 WHERE id = $2', [email, row.id]);
        return true;
      }

      return adminEmail === email;
    }
  },
  pages: {
    signIn: '/destro'
  },
  session: {
    strategy: 'database'
  }
});

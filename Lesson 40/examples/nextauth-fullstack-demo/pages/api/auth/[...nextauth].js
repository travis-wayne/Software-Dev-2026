// Lesson 40 — NextAuth.js Optional Catch-All Route Configuration
// Handles /api/auth/signin, /api/auth/signout, /api/auth/callback/*, and session serialization

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import db from '../../../lib/db';

export const authOptions = {
  providers: [
    // ─────────────────────────────────────────────────────────────
    // 1. CREDENTIALS PROVIDER (Email + Password via Bcrypt & SQL)
    // ─────────────────────────────────────────────────────────────
    CredentialsProvider({
      name: 'Email Credentials',
      credentials: {
        email: { label: "Email Address", type: "email", placeholder: "travis@wayne.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both your email address and password.');
        }

        const email = credentials.email.toLowerCase().trim();
        const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user || !user.password_hash) {
          throw new Error('No user found registered with this email address.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isPasswordValid) {
          throw new Error('Invalid password provided.');
        }

        // Return user object required by NextAuth (MUST include string ID!)
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        };
      }
    }),

    // ─────────────────────────────────────────────────────────────
    // 2. GITHUB OAUTH PROVIDER (Social Login Simulation/Integration)
    // ─────────────────────────────────────────────────────────────
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || 'mock_github_client_id_for_demo',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'mock_github_client_secret_for_demo'
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET || 'lesson_40_super_secret_development_key_change_in_production_123456789',

  callbacks: {
    // 1. Relay custom attributes from database into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },

    // 2. Relay token properties onto the browser session object for useSession()
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || 'user';
      }
      return session;
    }
  },

  pages: {
    signIn: '/login',
    error: '/login'
  }
};

export default NextAuth(authOptions);

// Lesson 40 — Application Root Wrapped with <SessionProvider>
// Enables global useSession(), signIn(), and signOut() hooks across all React pages

import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

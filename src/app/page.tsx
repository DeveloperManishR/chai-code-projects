import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Landing from '../screens/Landing';
import { ThemeProvider } from '../theme';

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect('/dashboard');
  }

  return (
    <ThemeProvider>
      <Landing />
    </ThemeProvider>
  );
}

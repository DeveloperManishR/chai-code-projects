import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/utils/corsair';
import { corsairAccounts, corsairIntegrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import OnboardingClient from './OnboardingClient';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/signup');

  const resolvedSearchParams = await searchParams;
  const oauthError = resolvedSearchParams.error;
  const userId = session.user.id;

  let connectedAccounts: any[] = [];
  let dbError = false;
  try {
    connectedAccounts = await db
      .select({
        name: corsairIntegrations.name,
        tenantId: corsairAccounts.tenantId,
        config: corsairAccounts.config,
      })
      .from(corsairAccounts)
      .innerJoin(corsairIntegrations, eq(corsairAccounts.integrationId, corsairIntegrations.id))
      .where(eq(corsairAccounts.tenantId, userId));
  } catch (err) {
    console.error("Database connection error:", err);
    dbError = true;
  }

  const isGmailConnected = connectedAccounts.some(
    (acc) => acc.name === 'gmail' && (acc.config as any)?.access_token
  );
  const isCalendarConnected = connectedAccounts.some(
    (acc) => acc.name === 'googlecalendar' && (acc.config as any)?.access_token
  );

  return (
    <OnboardingClient
      userName={session.user.name?.split(' ')[0] || 'User'}
      userEmail={session.user.email}
      userInitial={(session.user.name?.[0] || session.user.email?.[0] || 'U').toUpperCase()}
      isGmailConnected={isGmailConnected}
      isCalendarConnected={isCalendarConnected}
      dbError={dbError}
      oauthError={oauthError}
    />
  );
}

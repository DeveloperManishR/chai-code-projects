import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import ClientLayoutWrapper from './_components/ClientLayoutWrapper';
import { db, renewWatchesIfNeeded } from '@/utils/corsair';
import { corsairAccounts, corsairIntegrations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/signup');
  }

  const userId = session.user.id;

  // Trigger watch renewal in the background (runs asynchronously on page load)
  renewWatchesIfNeeded(userId).catch((err) => {
    console.error('[Dashboard Layout] Watch renewal check failed:', err);
  });

  // Check if both integrations are connected
  let connectedAccounts: any[] = [];
  try {
    connectedAccounts = await db
      .select({
        name: corsairIntegrations.name,
        config: corsairAccounts.config,
      })
      .from(corsairAccounts)
      .innerJoin(corsairIntegrations, eq(corsairAccounts.integrationId, corsairIntegrations.id))
      .where(eq(corsairAccounts.tenantId, userId));
  } catch (error) {
    console.error('Error querying connected accounts in dashboard layout:', error);
  }

  const isGmailConnected = connectedAccounts.some((acc) => acc.name === 'gmail' && (acc.config as any)?.access_token);
  const isCalendarConnected = connectedAccounts.some((acc) => acc.name === 'googlecalendar' && (acc.config as any)?.access_token);

  // If either integration is disconnected, redirect to onboarding page
  if (!isGmailConnected || !isCalendarConnected) {
    redirect('/onboarding');
  }

  const serializedUser = {
    id: userId,
    firstName: session.user.name?.split(' ')[0] || null,
    lastName: session.user.name?.split(' ').slice(1).join(' ') || null,
    email: session.user.email || '',
    imageUrl: session.user.image || '',
  };

  const projectName = process.env.ProjectName || 'SwiftMail';

  return (
    <ClientLayoutWrapper user={serializedUser} projectName={projectName}>
      {children}
    </ClientLayoutWrapper>
  );
}

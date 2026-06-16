import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import { db } from '@/utils/corsair';
import { userSubscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;

    const [sub] = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId));

    if (!sub || sub.status !== 'active') {
      return NextResponse.json({ error: 'No active plan found to cancel' }, { status: 400 });
    }

    // Set status to cancelled in DB, retaining current billing end date
    await db
      .update(userSubscriptions)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.userId, userId));

    return NextResponse.json({
      success: true,
      message: 'Plan cancelled successfully. Paid features remain active until cycle end.',
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

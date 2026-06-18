import { NextRequest, NextResponse } from 'next/server';
import { sendSubscriptionEmails } from '@/lib/mail';
import { saveSubscription } from '@/lib/subscriptions';

export async function POST(request: NextRequest) {
  let email: string | undefined;

  try {
    const body = await request.json();
    email = body.email;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log(`[SUBSCRIBE] Invalid email submitted: "${email}"`);
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    console.log(`[SUBSCRIBE] New subscription from: ${email}`);

    try {
      saveSubscription(email);
      console.log(`[SUBSCRIBE] Subscription saved for: ${email}`);
    } catch (saveErr) {
      console.log(`[SUBSCRIBE] Failed to save subscription for ${email}:`, saveErr);
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }

    try {
      await sendSubscriptionEmails(email);
      console.log(`[SUBSCRIBE] Emails sent for: ${email}`);
    } catch (mailErr) {
      console.log(`[SUBSCRIBE] Failed to send emails for ${email}:`, mailErr);
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }

    console.log(`[SUBSCRIBE] Subscription completed successfully: ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(`[SUBSCRIBE] Unexpected error processing subscription:`, error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

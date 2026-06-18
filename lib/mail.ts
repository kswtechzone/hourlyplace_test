import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT) || 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

console.log(`[MAIL] Config: host="${host}" port=${port} user="${user}" from="${process.env.FROM_EMAIL}" admin="${process.env.ADMIN_EMAIL}"`);
if (!host || !user || !pass) {
  console.log('[MAIL] WARNING: SMTP credentials are missing. Check your .env.local file and restart the dev server.');
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  requireTLS: port === 587,
  auth: { user, pass },
  connectionTimeout: 10000,
});

transporter.verify()
  .then(() => console.log('[MAIL] SMTP connection verified successfully'))
  .catch((err) => console.log('[MAIL] SMTP verification FAILED:', err));

function subscriberTemplate(email: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; background: #0f0c29; color: #e0e0e0; border-radius: 12px;">
      <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem; background: linear-gradient(to right, #a78bfa, #60a5fa); -webkit-background-clip: text; background-clip: text; color: transparent;">Hourlyplace</h1>
      <p style="color: #9ca3af; line-height: 1.6;">Thanks for subscribing, <strong style="color: #fff;">${email}</strong>!</p>
      <p style="color: #9ca3af; line-height: 1.6;">We're building something new — a platform to connect people with opportunities, one hour at a time. We'll let you know as soon as we launch.</p>
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5rem 0;" />
      <p style="color: #555; font-size: 0.8rem;">Hourlyplace by KSW Techzone, Nepal</p>
    </div>
  `;
}

function adminTemplate(email: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; background: #0f0c29; color: #e0e0e0; border-radius: 12px;">
      <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #fff;">New Subscription</h1>
      <p style="color: #9ca3af; line-height: 1.6;">A new user has subscribed to Hourlyplace.</p>
      <p style="color: #e0e0e0; font-size: 1.1rem;"><strong>Email:</strong> ${email}</p>
      <p style="color: #9ca3af; line-height: 1.6;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5rem 0;" />
      <p style="color: #555; font-size: 0.8rem;">Hourlyplace by KSW Techzone, Nepal</p>
    </div>
  `;
}

export async function sendSubscriptionEmails(email: string) {
  const from = process.env.FROM_EMAIL || user!;
  const adminEmail = process.env.ADMIN_EMAIL;

  try {
    await transporter.sendMail({
      from: `"Hourlyplace" <${from}>`,
      to: email,
      subject: 'You\'re subscribed to Hourlyplace!',
      html: subscriberTemplate(email),
    });
    console.log(`[MAIL] Subscriber email sent to ${email}`);
  } catch (err: any) {
    console.log(`[MAIL] Failed to send subscriber email to ${email}:`, err?.response || err?.message || err);
    throw err;
  }

  if (adminEmail) {
    try {
      await transporter.sendMail({
        from: `"Hourlyplace" <${from}>`,
        to: adminEmail,
        subject: 'New subscription on Hourlyplace',
        html: adminTemplate(email),
      });
      console.log(`[MAIL] Admin notification sent to ${adminEmail}`);
    } catch (err: any) {
      console.log(`[MAIL] Failed to send admin notification to ${adminEmail}:`, err?.response || err?.message || err);
      throw err;
    }
  }
}

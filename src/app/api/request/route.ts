import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { iconName, iconLink } = data;

    if (!iconName) {
      return NextResponse.json({ error: 'Icon name is required' }, { status: 400 });
    }

    // 1. Log the request (good for backup)
    console.log('NEW ICON REQUEST:', { iconName, iconLink, date: new Date().toISOString() });

    // 2. Send Email Notification via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'SkillIconsPlus <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL || '',
        subject: `🚀 New Icon Request: ${iconName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>New Icon Request Received!</h2>
            <p><strong>Icon Name:</strong> ${iconName}</p>
            <p><strong>Reference Link:</strong> ${iconLink || 'No link provided'}</p>
            <hr />
            <p style="font-size: 12px; color: #666;">Sent from SkillIconsPlus App</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ message: 'Request submitted successfully!' });
  } catch (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}

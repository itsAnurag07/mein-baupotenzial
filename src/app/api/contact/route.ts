import { NextResponse } from 'next/server';
import { emailService } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required (name, email, subject, message)' },
        { status: 400 }
      );
    }

    // Send the contact inquiry email to the admin
    await emailService.sendInternalContactInquiry(name, email, subject, message);

    return NextResponse.json({ success: true, message: 'Message sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

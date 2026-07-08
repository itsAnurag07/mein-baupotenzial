import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { emailService } from '@/lib/services/emailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if subscriber already exists
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email,
        name,
        source: 'NEWSLETTER',
      },
    });

    // Send welcome email
    try {
      await emailService.sendNewsletterWelcome(email, name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Notify admin
    try {
      await emailService.sendInternalNewSubscriber(email, name, 'NEWSLETTER');
    } catch (adminEmailError) {
      console.error('Failed to notify admin about new subscriber:', adminEmailError);
    }

    return NextResponse.json({ success: true, message: 'Successfully subscribed' }, { status: 201 });
  } catch (error: any) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

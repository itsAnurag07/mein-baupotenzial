import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Admin fetch contact inquiries error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, isRead } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing inquiry ID' }, { status: 400 });
    }

    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: { isRead }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Admin update contact inquiry error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { dbService } from '@/lib/services/dbService';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leads = await dbService.getAllLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Admin fetch leads error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


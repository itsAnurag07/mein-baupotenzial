import { NextResponse } from 'next/server';
import { dbService } from '@/lib/services/dbService';
import { emailService } from '@/lib/services/emailService';

export async function POST() {
  try {
    const lead = await dbService.createLead();
    
    // Attempt internal notification for a new draft lead (non-blocking)
    try {
      await emailService.sendInternalNewLead(lead.id, '', '', '');
    } catch (err) {
      console.error('Error sending internal lead email:', err);
    }
    
    return NextResponse.json({ id: lead.id, currentStep: lead.currentStep });
  } catch (error: any) {
    console.error('Failed to create draft lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

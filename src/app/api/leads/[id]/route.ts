import { NextResponse } from 'next/server';
import { dbService } from '@/lib/services/dbService';
import { emailService } from '@/lib/services/emailService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lead = await dbService.getLead(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Failed to fetch lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Fetch current state of the lead first to see if status is changing
    const currentLead = await dbService.getLead(id);
    
    const updatedLead = await dbService.updateLead(id, body);

    // Notify internal team if the wizard status transitioned to COMPLETED
    if (body.status === 'COMPLETED' && currentLead?.status !== 'COMPLETED') {
      try {
        const customerName = updatedLead.contactFirstName || updatedLead.contactLastName 
          ? `${updatedLead.contactFirstName || ''} ${updatedLead.contactLastName || ''}`.trim() 
          : updatedLead.contactName || 'Kunde';

        await emailService.sendInternalCompletedSubmission(
          id, 
          customerName, 
          updatedLead.packageSelected || 'Kein Paket', 
          updatedLead.paymentMethod || 'Ausstehend'
        );
        
        // Also send order confirmation to customer
        if (updatedLead.contactEmail) {
          const price = updatedLead.packageSelected === 'QUICK_CHECK' ? 189 
            : updatedLead.packageSelected === 'POTENTIAL_ANALYSIS' ? 490 
            : 2490;
          
          await emailService.sendOrderConfirmation(
            updatedLead.contactEmail,
            customerName,
            updatedLead.packageSelected === 'QUICK_CHECK' ? 'Quick Check'
              : updatedLead.packageSelected === 'POTENTIAL_ANALYSIS' ? 'Potenzialanalyse'
              : 'Machbarkeitsstudie',
            price,
            updatedLead.paymentMethod === 'BANK_TRANSFER',
            id
          );
        }
      } catch (err) {
        console.error('Failed to send status update notification emails:', err);
      }
    }
    
    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Failed to update lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

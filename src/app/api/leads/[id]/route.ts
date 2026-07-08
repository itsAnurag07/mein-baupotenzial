import { NextResponse } from 'next/server';
import { dbService } from '@/lib/services/dbService';
import { emailService } from '@/lib/services/emailService';
import prisma from '@/lib/prisma';

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
    
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.warn('⚠️ Received empty or invalid JSON body in PATCH request.');
      return NextResponse.json({ error: 'Invalid or empty JSON body' }, { status: 400 });
    }
    
    // Fetch current state of the lead first to see if status is changing
    const currentLead = await dbService.getLead(id);
    if (!currentLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Validate referral code payment method
    if (body.paymentMethod === 'REFERRAL') {
      const pkg = body.packageSelected || currentLead.packageSelected;
      if (pkg !== 'QUICK_CHECK') {
        return NextResponse.json(
          { error: 'Referral code only applies to Quick Check package.' },
          { status: 400 }
        );
      }

      const code = body.referralCodeUsed || currentLead.referralCodeUsed || '';
      const ref = await dbService.getReferralCode(code);
      if (!ref || !ref.isValid || (ref.maxUses !== null && ref.currentUses >= ref.maxUses)) {
        return NextResponse.json(
          { error: 'Invalid, expired, or fully used referral code.' },
          { status: 400 }
        );
      }

      // Increment referral code usage count
      await dbService.incrementReferralCode(ref.code);
    }
    
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
          const price = updatedLead.packageSelected === 'QUICK_CHECK' ? 249 
            : updatedLead.packageSelected === 'POTENTIAL_ANALYSIS' ? 690 
            : 3490;
          
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

          // Automatically subscribe customer to newsletter database
          try {
            const existingSubscriber = await prisma.subscriber.findUnique({
              where: { email: updatedLead.contactEmail },
            });

            if (!existingSubscriber) {
              await prisma.subscriber.create({
                data: {
                  email: updatedLead.contactEmail,
                  name: customerName,
                  source: 'CHECKOUT',
                },
              });

              // Send welcome to newsletter email (2nd email)
              await emailService.sendNewsletterWelcome(updatedLead.contactEmail, customerName);

              // Notify admin about new subscription
              await emailService.sendInternalNewSubscriber(updatedLead.contactEmail, customerName, 'CHECKOUT');
            }
          } catch (subscribeErr) {
            console.error('Failed to auto-subscribe customer to newsletter:', subscribeErr);
          }
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

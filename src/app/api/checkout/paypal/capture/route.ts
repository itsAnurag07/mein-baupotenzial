import { NextResponse } from 'next/server';
import { dbService } from '@/lib/services/dbService';
import { emailService } from '@/lib/services/emailService';

// Fetch PayPal access token
async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'mock_secret';
  const apiUrl = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

  if (clientId === 'sb' && clientSecret === 'mock_secret') {
    return 'mock_token';
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const { orderId, leadId } = await request.json();

    if (!orderId || !leadId) {
      return NextResponse.json({ error: 'Missing required parameters (orderId, leadId)' }, { status: 400 });
    }

    const lead = await dbService.getLead(leadId);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const token = await getPayPalAccessToken();

    // If it's a mock checkout, skip calling PayPal API
    if (token === 'mock_token' || orderId === 'MOCK_PAYMENT') {
      console.log(`💰 PayPal Capture Mock Success: leadId=${leadId}, orderId=${orderId}`);
      
      const price = lead.packageSelected === 'QUICK_CHECK' ? 249 
        : lead.packageSelected === 'POTENTIAL_ANALYSIS' ? 690 
        : 3490;
      
      // Update lead to PAID status
      await dbService.updateLead(leadId, {
        status: 'PAID',
        paymentMethod: 'PAYPAL',
        paymentStatus: 'SUCCESS',
        pricePaid: price
      });

      // Send email notifications
      try {
        await emailService.sendPaymentConfirmation(
          lead.contactEmail || '',
          lead.contactName || 'Kunde',
          lead.packageSelected === 'QUICK_CHECK' ? 'Quick Check' : lead.packageSelected === 'POTENTIAL_ANALYSIS' ? 'Potenzialanalyse' : 'Machbarkeitsstudie',
          price
        );
        await emailService.sendNextSteps(
          lead.contactEmail || '',
          lead.contactName || 'Kunde',
          lead.packageSelected === 'QUICK_CHECK' ? 'Quick Check' : lead.packageSelected === 'POTENTIAL_ANALYSIS' ? 'Potenzialanalyse' : 'Machbarkeitsstudie',
          lead.timeline || 'Unbekannt'
        );
        await emailService.sendInternalPaymentReceived(leadId, price, 'PAYPAL');
      } catch (err) {
        console.error('Failed to send PayPal mock success notification emails:', err);
      }

      return NextResponse.json({ success: true, mock: true });
    }

    const apiUrl = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

    // Capture the payment via PayPal API
    const response = await fetch(`${apiUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error('PayPal Capture API Error details:', errorDetail);
      return NextResponse.json({ error: 'PayPal API capture failed' }, { status: 400 });
    }

    const captureData = await response.json();
    const purchaseUnit = captureData.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];

    if (capture?.status === 'COMPLETED') {
      const amount = parseFloat(capture.amount.value);
      
      // Update Lead Status to PAID
      await dbService.updateLead(leadId, {
        status: 'PAID',
        paymentMethod: 'PAYPAL',
        paymentStatus: 'SUCCESS',
        pricePaid: amount
      });

      // Send email notifications
      try {
        await emailService.sendPaymentConfirmation(
          lead.contactEmail || '',
          lead.contactName || 'Kunde',
          lead.packageSelected === 'QUICK_CHECK' ? 'Quick Check' : lead.packageSelected === 'POTENTIAL_ANALYSIS' ? 'Potenzialanalyse' : 'Machbarkeitsstudie',
          amount
        );
        await emailService.sendNextSteps(
          lead.contactEmail || '',
          lead.contactName || 'Kunde',
          lead.packageSelected === 'QUICK_CHECK' ? 'Quick Check' : lead.packageSelected === 'POTENTIAL_ANALYSIS' ? 'Potenzialanalyse' : 'Machbarkeitsstudie',
          lead.timeline || 'Unbekannt'
        );
        await emailService.sendInternalPaymentReceived(leadId, amount, 'PAYPAL');
      } catch (err) {
        console.error('Failed to send PayPal capture confirmation emails:', err);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Payment capture not completed' }, { status: 400 });
  } catch (error: any) {
    console.error('PayPal checkout capture error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

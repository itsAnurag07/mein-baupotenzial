import { NextResponse } from 'next/server';
import { dbService } from '@/lib/services/dbService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ isValid: false, message: 'Kein Code angegeben' });
    }

    const refCode = await dbService.getReferralCode(code);

    if (!refCode) {
      return NextResponse.json({ isValid: false, message: 'Ungültiger Gutscheincode' });
    }

    if (!refCode.isValid) {
      return NextResponse.json({ isValid: false, message: 'Dieser Code ist nicht mehr gültig' });
    }

    if (refCode.maxUses !== null && refCode.maxUses !== undefined && refCode.currentUses >= refCode.maxUses) {
      return NextResponse.json({ isValid: false, message: 'Dieser Code wurde bereits maximal genutzt' });
    }

    return NextResponse.json({ isValid: true, code: refCode.code });
  } catch (error) {
    console.error('Referral verification error:', error);
    return NextResponse.json({ isValid: false, message: 'Interner Fehler bei der Validierung' }, { status: 500 });
  }
}

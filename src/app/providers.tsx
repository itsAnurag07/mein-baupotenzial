'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export function Providers({ children }: { children: React.ReactNode }) {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb';

  return (
    <SessionProvider>
      <PayPalScriptProvider 
        options={{ 
          clientId: paypalClientId,
          currency: 'EUR',
          intent: 'capture',
          components: 'buttons'
        }}
      >
        {children}
      </PayPalScriptProvider>
    </SessionProvider>
  );
}

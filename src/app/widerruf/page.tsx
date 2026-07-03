import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WiderrufPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full font-sans">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-8 border-b border-surface-dim pb-4">Widerrufsbelehrung</h1>
        
        <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">Widerrufsrecht</h2>
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von GrÃ¼nden diesen Vertrag zu widerrufen.
            </p>
            <p>
              Die Widerrufsfrist betrÃ¤gt vierzehn Tage ab dem Tag des Vertragsabschlusses.
            </p>
            <p>
              Um Ihr Widerrufsrecht auszuÃ¼ben, mÃ¼ssen Sie uns (van Valkenburg GmbH, KÃ¶nigsallee 60F, 40212 DÃ¼sseldorf, E-Mail: info@mein-baupotenzial.de) mittels einer eindeutigen ErklÃ¤rung (z. B. ein mit der Post versandter Brief oder E-Mail) Ã¼ber Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">Folgen des Widerrufs</h2>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzÃ¼glich und spÃ¤testens binnen vierzehn Tagen ab dem Tag zurÃ¼ckzuzahlen, an dem die Mitteilung Ã¼ber Ihren Widerruf dieses Vertrags bei uns eingegangen ist. FÃ¼r diese RÃ¼ckzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprÃ¼nglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrÃ¼cklich etwas anderes vereinbart.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">Besonderer Hinweis zum vorzeitigen ErlÃ¶schen</h2>
            <p className="p-4 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-semibold">
              Ihr Widerrufsrecht erlischt vorzeitig, wenn wir die Dienstleistung vollstÃ¤ndig erbracht haben und mit der AusfÃ¼hrung der Dienstleistung erst begonnen haben, nachdem Sie dazu Ihre ausdrÃ¼ckliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestÃ¤tigt haben, dass Sie Ihr Widerrufsrecht bei vollstÃ¤ndiger VertragserfÃ¼llung durch uns verlieren.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

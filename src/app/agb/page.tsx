import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AGBPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full font-sans">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-8 border-b border-surface-dim pb-4">Allgemeine GeschÃ¤ftsbedingungen (AGB)</h1>
        
        <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Geltungsbereich und VertrÃ¤ge</h2>
            <p>
              Diese Allgemeinen GeschÃ¤ftsbedingungen gelten fÃ¼r alle VertrÃ¤ge Ã¼ber die Erstellung von planungsrechtlichen und stÃ¤dtebaulichen Potenzialanalysen, die zwischen der van Valkenburg GmbH (nachfolgend â€žAnbieterâ€œ) und Kunden Ã¼ber die Plattform mein-baupotenzial.de geschlossen werden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Wichtiger rechtlicher Hinweis / Leistungsbeschreibung</h2>
            <div className="p-4 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-semibold mb-4">
              Der Kunde nimmt ausdrÃ¼cklich zur Kenntnis, dass die angebotenen Analysen eine stÃ¤dtebauliche und planungsrechtliche FacheinschÃ¤tzung (Machbarkeits-VorprÃ¼fung) darstellen und KEIN behÃ¶rdliches Genehmigungsverfahren (z.B. Bauvorbescheid, Baugenehmigung) ersetzen. Der Anbieter Ã¼bernimmt keine GewÃ¤hr fÃ¼r die spÃ¤tere tatsÃ¤chliche Erteilung einer Baugenehmigung durch die zustÃ¤ndigen BehÃ¶rden. Eine Rechtsberatung wird nicht geschuldet.
            </div>
            <p>
              Gegenstand des Vertrages ist die Lieferung einer gutachterlichen Stellungnahme in Form eines PDF-Berichts zu den vom Kunden Ã¼bermittelten GrundstÃ¼cksdaten. Je nach gewÃ¤hltem Paket (Quick Check, Potenzialanalyse, Machbarkeitsstudie) sind zusÃ¤tzliche BeratungsgesprÃ¤che inkludiert.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Zahlungsbedingungen & Preise</h2>
            <p>
              Alle Preise verstehen sich zuzÃ¼glich der gesetzlichen Mehrwertsteuer (VAT). Die Zahlung erfolgt wahlweise per PayPal oder per BankÃ¼berweisung. Die Bearbeitung der Analyse beginnt erst nach vollstÃ¤ndigem Zahlungseingang auf dem Konto des Anbieters.
            </p>
            <ul>
              <li><strong>Quick Check:</strong> 189 â‚¬ (zzgl. MwSt.)</li>
              <li><strong>Potenzialanalyse:</strong> 490 â‚¬ (zzgl. MwSt.)</li>
              <li><strong>Machbarkeitsstudie:</strong> 2.490 â‚¬ (zzgl. MwSt.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Referral-Code (Gutscheine)</h2>
            <p>
              Gutschein- oder Referral-Codes sind ausschlieÃŸlich fÃ¼r das Paket â€žQuick Checkâ€œ gÃ¼ltig. Bei Eingabe eines gÃ¼ltigen Gutscheincodes reduziert sich der Preis des Quick Checks auf 0 â‚¬. Referral-Codes sind nicht auf die Pakete â€žPotenzialanalyseâ€œ oder â€žMachbarkeitsstudieâ€œ anwendbar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Mitwirkungspflichten des Kunden</h2>
            <p>
              Der Kunde ist verpflichtet, alle zur Erstellung der Analyse notwendigen Unterlagen (z.B. Flurkarten, BestandsplÃ¤ne) vollstÃ¤ndig und wahrheitsgemÃ¤ÃŸ Ã¼ber den Dateiupload einzureichen. Die maximale DateigrÃ¶ÃŸe betrÃ¤gt 25MB pro Datei. ZulÃ¤ssig sind die Formate PDF, JPG und PNG.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Haftungsbegrenzung</h2>
            <p>
              Die Haftung des Anbieters fÃ¼r SchÃ¤den, die aus einer fehlerhaften EinschÃ¤tzung resultieren, ist auf Vorsatz und grobe FahrlÃ¤ssigkeit beschrÃ¤nkt. Die stÃ¤dtebauliche PrÃ¼fung erfolgt nach bestem Wissen auf Grundlage der zum Zeitpunkt der PrÃ¼fung Ã¶ffentlich zugÃ¤nglichen Geoportale und Satzungen.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

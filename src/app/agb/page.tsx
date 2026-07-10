import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen (AGB) | mein-baupotenzial.de',
  description: 'Allgemeine Geschäftsbedingungen der van Valkenburg GmbH für die Erstellung städtebaulicher Analysen und planungsrechtlicher Vorprüfungen.',
};

export default function AGBPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full font-sans">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-8 border-b border-surface-dim pb-4">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Geltungsbereich und Verträge</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über die Erstellung von
              planungsrechtlichen und städtebaulichen Potenzialanalysen, die zwischen der van Valkenburg GmbH
              (nachfolgend „Anbieter") und Kunden über die Plattform mein-baupotenzial.de geschlossen werden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Wichtiger rechtlicher Hinweis / Leistungsbeschreibung</h2>
            <div className="p-4 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-semibold mb-4">
              Der Kunde nimmt ausdrücklich zur Kenntnis, dass die angebotenen Analysen eine städtebauliche und
              planungsrechtliche Facheinschätzung (Machbarkeits-Vorprüfung) darstellen und KEIN behördliches
              Genehmigungsverfahren (z.B. Bauvorbescheid, Baugenehmigung) ersetzen. Der Anbieter übernimmt
              keine Gewähr für die spätere tatsächliche Erteilung einer Baugenehmigung durch die zuständigen
              Behörden. Eine Rechtsberatung wird nicht geschuldet.
            </div>
            <p>
              Gegenstand des Vertrages ist die Lieferung einer gutachterlichen Stellungnahme in Form eines
              PDF-Berichts zu den vom Kunden übermittelten Grundstücksdaten. Je nach gewähltem Paket
              (QuickCheck, Potenzialanalyse, Machbarkeitsstudie) sind zusätzliche Beratungsgespräche inkludiert.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Zahlungsbedingungen &amp; Preise</h2>
            <p className="mb-3">
              Alle angegebenen Preise verstehen sich als Endpreise inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung
              erfolgt wahlweise per PayPal oder per Banküberweisung. Die Bearbeitung der Analyse beginnt erst
              nach vollständigem Zahlungseingang auf dem Konto des Anbieters.
            </p>
            <ul className="space-y-1 list-none pl-0">
              <li><strong>QuickCheck:</strong> 249 € (inkl. MwSt.)</li>
              <li><strong>Potenzialanalyse:</strong> 690 € (inkl. MwSt.)</li>
              <li><strong>Machbarkeitsstudie:</strong> ab 3.490 € (inkl. MwSt.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Referral-Code (Gutscheine)</h2>
            <p>
              Gutschein- oder Referral-Codes sind ausschließlich für das Paket „QuickCheck" gültig. Bei Eingabe
              eines gültigen Gutscheincodes reduziert sich der Preis des QuickChecks auf 0&nbsp;€. Referral-Codes
              sind nicht auf die Pakete „Potenzialanalyse" oder „Machbarkeitsstudie" anwendbar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Mitwirkungspflichten des Kunden</h2>
            <p>
              Der Kunde ist verpflichtet, alle zur Erstellung der Analyse notwendigen Unterlagen (z.B. Flurkarten,
              Bestandspläne) vollständig und wahrheitsgemäß über den Dateiupload einzureichen. Die maximale
              Dateigröße beträgt 25&nbsp;MB pro Datei. Zulässig sind die Formate PDF, JPG und PNG.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Haftungsbegrenzung</h2>
            <p>
              Die Haftung des Anbieters für Schäden, die aus einer fehlerhaften Einschätzung resultieren, ist auf
              Vorsatz und grobe Fahrlässigkeit beschränkt. Die städtebauliche Prüfung erfolgt nach bestem Wissen
              auf Grundlage der zum Zeitpunkt der Prüfung öffentlich zugänglichen Geoportale und Satzungen.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

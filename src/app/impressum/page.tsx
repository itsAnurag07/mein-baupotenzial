import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Impressum | mein-baupotenzial.de',
  description: 'Rechtliche Angaben und Impressum für die Online-Plattform mein-baupotenzial.de, betrieben von der van Valkenburg GmbH.',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full font-sans">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-8 border-b border-surface-dim pb-4">Impressum</h1>

        <div className="space-y-8 text-on-surface-variant text-sm leading-relaxed">

          {/* Angaben gemäß § 5 TMG */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Angaben gemäß § 5 TMG</h2>
            <p className="mb-4">
              van Valkenburg GmbH<br />
              c/o Ulmer Schanze<br />
              Wagnerstraße 25<br />
              89077 Ulm
            </p>
            <p className="mb-4">
              <strong>Vertreten durch:</strong><br />
              Wolf Probst (Geschäftsführer)
            </p>
            <p className="mb-4">
              <strong>Registereintrag:</strong><br />
              Registergericht: Amtsgericht Ulm<br />
              Registernummer: HRB 747631
            </p>
            <p>
              <strong>Umsatzsteuer-ID:</strong><br />
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              DE367081625
            </p>
          </section>

          {/* Kontakt */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Kontakt</h2>
            <p>
              Tel. 073114394705 <br />
              E-Mail:{' '}
              <a href="mailto:wolf@van-valkenburg.de" className="text-secondary hover:underline">
                info@van-valkenburg.de
              </a>
            </p>
          </section>

          {/* Bildnachweise */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Bildnachweise</h2>
            <p>
              Bilder:{' '}
              <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                gemini.google.com
              </a>
            </p>
          </section>

          {/* Design */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Verantwortlich für das Design</h2>
            <p>
              Intelloft<br />
              Wolf Probst
            </p>
          </section>

          {/* Inhalt */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Verantwortlich für den Inhalt gem. § 55 Abs. 2 RStV</h2>
            <p>Wolf Probst</p>
          </section>

          <hr className="border-surface-dim" />

          {/* Haftungsausschluss */}
          <section>
            <h2 className="text-xl font-bold text-primary mb-4">Haftungsausschluss (Disclaimer)</h2>

            <h3 className="text-base font-semibold text-primary mb-2">Haftung für Inhalte</h3>
            <p className="mb-6">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>

            <h3 className="text-base font-semibold text-primary mb-2">Haftung für Links</h3>
            <p className="mb-6">
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>

            <h3 className="text-base font-semibold text-primary mb-2">Urheberrecht</h3>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

          <hr className="border-surface-dim" />

          {/* Quelle */}
          <section>
            <p className="text-xs text-on-surface-variant/60">
              Quelle:{' '}
              <a href="http://www.e-recht24.de" target="_blank" rel="noopener noreferrer" className="hover:underline">
                http://www.e-recht24.de
              </a>
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

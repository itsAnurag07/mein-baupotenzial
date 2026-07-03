import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full font-sans">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-8 border-b border-surface-dim pb-4">Impressum</h1>
        
        <div className="space-y-8 text-on-surface-variant text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Angaben gemÃ¤ÃŸ Â§ 5 TMG</h2>
            <p>
              van Valkenburg GmbH<br />
              KÃ¶nigsallee 60F<br />
              40212 DÃ¼sseldorf
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Vertretung</h2>
            <p>
              <strong>Vertreten durch die GeschÃ¤ftsfÃ¼hrer:</strong><br />
              Maximilian van Valkenburg
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Kontakt</h2>
            <p>
              Telefon: +49 (0) 211 1234567<br />
              E-Mail: info@mein-baupotenzial.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Registereintrag</h2>
            <p>
              Eintragung im Handelsregister.<br />
              Registergericht: Amtsgericht DÃ¼sseldorf<br />
              Registernummer: HRB 98765
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Umsatzsteuer-ID</h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemÃ¤ÃŸ Â§ 27 a Umsatzsteuergesetz:<br />
              DE 123 456 789
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>
              Es gelten die stÃ¤dtebaulichen und gewerberechtlichen Vorschriften der Bundesrepublik Deutschland.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-2">EU-Streitschlichtung</h2>
            <p>
              Die EuropÃ¤ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">https://ec.europa.eu/consumers/odr/</a>.<br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-2">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

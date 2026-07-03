import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full font-sans">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-8 border-b border-surface-dim pb-4">DatenschutzerklÃ¤rung</h1>
        
        <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-base font-semibold text-primary mb-2">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Ãœberblick darÃ¼ber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persÃ¶nlich identifiziert werden kÃ¶nnen. AusfÃ¼hrliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgefÃ¼hrten DatenschutzerklÃ¤rung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-base font-semibold text-primary mb-2">Verantwortliche Stelle</h3>
            <p>
              Die verantwortliche Stelle fÃ¼r die Datenverarbeitung auf dieser Website ist:<br />
              van Valkenburg GmbH<br />
              KÃ¶nigsallee 60F<br />
              40212 DÃ¼sseldorf<br />
              E-Mail: info@mein-baupotenzial.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Datenerfassung auf dieser Website</h2>
            <h3 className="text-base font-semibold text-primary mb-2">Wie erfassen wir Ihre Daten?</h3>
            <p>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.&nbsp;B. um Daten handeln, die Sie in unser 10-Schritt-Analyseformular eingeben oder hochladen. Incomplete Wizard-Eingaben werden temporÃ¤r zwischengespeichert (Autosave-Funktion), um die Nutzung der Webseite benutzerfreundlich zu gestalten.
            </p>
            <h3 className="text-base font-semibold text-primary mb-2">WofÃ¼r nutzen wir Ihre Daten?</h3>
            <p>
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewÃ¤hrleisten. Andere Daten kÃ¶nnen zur Analyse Ihres Nutzerverhaltens oder zur Erstellung Ihrer angeforderten bauplanungsrechtlichen Potenzialanalyse verwendet werden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Analyse-Tools und Tools von Drittanbietern</h2>
            <p>
              Beim Besuch unserer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit Cookies und mit sogenannten Analyseprogrammen. FÃ¼r die Bezahlung binden wir die Dienste von PayPal ein. Bitte beachten Sie deren separate DatenschutzerklÃ¤rung bei der Nutzung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft Ã¼ber Herkunft, EmpfÃ¤nger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben auÃŸerdem ein Recht, die Berichtigung, Sperrung oder LÃ¶schung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz kÃ¶nnen Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

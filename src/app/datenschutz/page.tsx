import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | mein-baupotenzial.de',
  description: 'Informationen darüber, wie wir Ihre personenbezogenen Daten erheben, verarbeiten und schützen. DSGVO-konforme Datenschutzerklärung.',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full font-sans">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-8 border-b border-surface-dim pb-4">Datenschutzerklärung</h1>

        <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-base font-semibold text-primary mb-2">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-base font-semibold text-primary mb-2">Verantwortliche Stelle</h3>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
              van Valkenburg GmbH<br />
              c/o Ulmer Schanze<br />
              Wagnerstraße 25<br />
              89077 Ulm<br />
              E-Mail: info@van-valkenburg.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Datenerfassung auf dieser Website</h2>
            <h3 className="text-base font-semibold text-primary mb-2">Wie erfassen wir Ihre Daten?</h3>
            <p>
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.&nbsp;B. um Daten handeln, die Sie in unser 10-Schritt-Analyseformular eingeben oder hochladen. Incomplete Wizard-Eingaben werden temporär zwischengespeichert (Autosave-Funktion), um die Nutzung der Webseite benutzerfreundlich zu gestalten.
            </p>
            <h3 className="text-base font-semibold text-primary mb-2">Wofür nutzen wir Ihre Daten?</h3>
            <p>
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens oder zur Erstellung Ihrer angeforderten bauplanungsrechtlichen Potenzialanalyse verwendet werden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Analyse-Tools und Tools von Drittanbietern</h2>
            <p>
              Beim Besuch unserer Website kann Ihr Surf-Verhalten statistisch ausgewertet werden. Das geschieht vor allem mit Cookies und mit sogenannten Analyseprogrammen. Für die Bezahlung binden wir die Dienste von PayPal ein. Bitte beachten Sie deren separate Datenschutzerklärung bei der Nutzung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

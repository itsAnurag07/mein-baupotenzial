import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary-container text-surface-container border-t border-primary-container mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img src="/footer logo.png" alt="mein-baupotenzial.de Logo" className="h-10 w-auto object-contain mb-4" />
            <h3 className="text-lg font-bold text-white mb-4">van Valkenburg GmbH</h3>
            <p className="text-sm text-outline-variant leading-relaxed">
              Ihr Partner für planungsrechtliche Grundstücksprüfungen und städtebauliche Beratung in Deutschland.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4 font-sans">Rechtliches</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/impressum" className="text-outline-variant hover:text-white transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="text-outline-variant hover:text-white transition-colors">Datenschutz</Link>
              <Link href="/agb" className="text-outline-variant hover:text-white transition-colors">AGB</Link>
              <Link href="/widerruf" className="text-outline-variant hover:text-white transition-colors">Widerrufsbelehrung</Link>
              <Link href="/kontakt" className="text-outline-variant hover:text-white transition-colors">Kontakt</Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Kontakt</h3>
            <p className="text-sm text-outline-variant leading-relaxed">
              van Valkenburg GmbH<br />
              Email: info@mein-baupotenzial.de<br />
              Tel: +49 (0) 211 1234567
            </p>
          </div>
        </div>

        <div className="border-t border-on-tertiary-fixed-variant pt-6 pb-4">
          <p className="text-xs text-outline text-justify leading-relaxed mb-6">
            <strong>Wichtiger rechtlicher Hinweis:</strong> mein-baupotenzial.de ist eine städtebauliche und planungsrechtliche Analyse- und Machbarkeitsplattform zur Vorab-Einschätzung. Wir bieten städtebauliche und planungsrechtliche Beratungsleistungen durch Fachexperten. Wir erbringen keine Rechtsdienstleistungen im Sinne des RDG und keine Architektenleistungen für Genehmigungsplanungen. Unsere Analyse entfaltet keine rechtliche Bindungswirkung gegenüber Bauaufsichtsbehörden und ersetzt keinen offiziellen Bauvorbescheid oder Baugenehmigungsantrag.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-outline">
            <p>© {new Date().getFullYear()} van Valkenburg GmbH. Alle Rechte vorbehalten.</p>
            <p className="mt-2 sm:mt-0">Entwickelt für den deutschen Immobilienmarkt.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

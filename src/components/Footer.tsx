import React from 'react';
import Link from 'next/link';
import { Building2, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      {/* Main 6-column grid */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-16 pb-12">
        <div className="flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap sm:justify-between gap-10 mb-14 w-full">


          {/* Col 2: Leistungen */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-5">
              Leistungen
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li><Link href="/analyse?package=QUICK_CHECK" className="text-white/60 hover:text-white transition-colors duration-[120ms]">QuickCheck</Link></li>
              <li><Link href="/analyse?package=POTENTIAL_ANALYSIS" className="text-white/60 hover:text-white transition-colors duration-[120ms]">Potenzialanalyse</Link></li>
              <li><Link href="/analyse?package=FEASIBILITY_STUDY" className="text-white/60 hover:text-white transition-colors duration-[120ms]">Machbarkeitsstudie</Link></li>
              <li><Link href="/#leistungen" className="text-white/60 hover:text-white transition-colors duration-[120ms]">Alle Leistungen</Link></li>
            </ul>
          </div>



          {/* Col 5: Rechtliches */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-5">
              Rechtliches
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li><Link href="/impressum" className="text-white/60 hover:text-white transition-colors duration-[120ms]">Impressum</Link></li>
              <li><Link href="/datenschutz" className="text-white/60 hover:text-white transition-colors duration-[120ms]">Datenschutz</Link></li>
              <li><Link href="/agb" className="text-white/60 hover:text-white transition-colors duration-[120ms]">AGB</Link></li>
              <li><Link href="/widerruf" className="text-white/60 hover:text-white transition-colors duration-[120ms]">Widerrufsbelehrung</Link></li>
            </ul>
          </div>

          {/* Col 6: Kontakt */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-5">
              Kontakt
            </h4>
            <ul className="space-y-3 text-[14px] text-white/60">
              <li className="flex items-start gap-2">
                <Building2 size={14} strokeWidth={2} className="text-accent mt-0.5 flex-shrink-0" />
                <span>
                  mein Baupotenzial<br />
                  c/o Ulmer Schanze<br />
                  Prittwitzstraße 100,<br /> 89075 Ulm
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} strokeWidth={2} className="text-accent mt-0.5 flex-shrink-0" />
                <a href="mailto:info@mein-baupotenzial.com" className="hover:text-white transition-colors duration-[120ms] whitespace-nowrap">
                  info@mein-baupotenzial.de
                </a>
              </li>

              <li className="mt-5">
                <Link
                  href="/analyse"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap bg-secondary text-on-secondary text-[13px] font-semibold px-4 hover:bg-cta-hover transition-colors duration-[120ms]"
                  style={{ height: '38px', borderRadius: '10px' }}
                >
                  <Building2 size={13} strokeWidth={2} />
                  Grundstück analysieren
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Brand description + divider */}
        <div className="border-t border-white/10 pt-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <img
              src="/logo_without_bg_1.png"
              alt="mein-baupotenzial.de Logo"
              className="h-12 w-auto object-contain opacity-80"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-[14px] text-white/40 leading-relaxed">
              Unabhängige Baupotenzialanalysen für Eigentümer, Investoren und Projektentwickler.
            </p>
          </div>

          {/* Legal notice */}
          <p className="text-[12px] text-white/25 leading-relaxed mb-6">
            <strong className="text-white/35">Rechtlicher Hinweis:</strong> Keine Rechtsdienstleistung gem. RDG. Analysen sind nicht rechtlich bindend und ersetzen keinen Bauvorbescheid.
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-center text-[12px] text-white/25 gap-2">
            <p>© {year} mein-baupotenzial</p>
            <p>Entwickelt für den deutschen Immobilienmarkt.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

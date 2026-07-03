import React from 'react';
import Link from 'next/link';
import { FileText, FileCheck, Building2, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      {/* Main 6-column grid */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">

          {/* Col 1: Unternehmen */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-5">
              Unternehmen
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li><Link href="/#so-funktionierts" className="text-white/60 hover:text-white transition-colors duration-[120ms]">Über uns</Link></li>
              <li><Link href="/#leistungen"       className="text-white/60 hover:text-white transition-colors duration-[120ms]">Unser Team</Link></li>
              <li><Link href="/kontakt"            className="text-white/60 hover:text-white transition-colors duration-[120ms]">Karriere</Link></li>
              <li><Link href="/kontakt"            className="text-white/60 hover:text-white transition-colors duration-[120ms]">Presse</Link></li>
            </ul>
          </div>

          {/* Col 2: Leistungen */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-5">
              Leistungen
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li><Link href="/analyse?package=QUICK_CHECK"        className="text-white/60 hover:text-white transition-colors duration-[120ms]">QuickCheck</Link></li>
              <li><Link href="/analyse?package=POTENTIAL_ANALYSIS" className="text-white/60 hover:text-white transition-colors duration-[120ms]">Potenzialanalyse</Link></li>
              <li><Link href="/analyse?package=FEASIBILITY_STUDY" className="text-white/60 hover:text-white transition-colors duration-[120ms]">Machbarkeitsstudie</Link></li>
              <li><Link href="/#leistungen"                        className="text-white/60 hover:text-white transition-colors duration-[120ms]">Alle Leistungen</Link></li>
            </ul>
          </div>

          {/* Col 3: Wissen */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-5">
              Wissen
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li><Link href="/#wissen"               className="text-white/60 hover:text-white transition-colors duration-[120ms]">Baupotenzial verstehen</Link></li>
              <li><Link href="/#faq"                  className="text-white/60 hover:text-white transition-colors duration-[120ms]">Planungsrecht erklärt</Link></li>
              <li><Link href="/#faq"                  className="text-white/60 hover:text-white transition-colors duration-[120ms]">Nachverdichtung</Link></li>
              <li><Link href="/#faq"                  className="text-white/60 hover:text-white transition-colors duration-[120ms]">Grundstücksteilung</Link></li>
              <li><Link href="/#baupotenzial-report"  className="text-white/60 hover:text-white transition-colors duration-[120ms]">Baupotenzial-Report</Link></li>
            </ul>
          </div>

          {/* Col 4: Downloads */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-5">
              Downloads
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <a
                  href="/sample-report.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors duration-[120ms] flex items-center gap-1.5"
                >
                  <FileText size={13} strokeWidth={2} className="text-accent flex-shrink-0" />
                  Beispielanalyse (PDF)
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors duration-[120ms] flex items-center gap-1.5">
                  <FileCheck size={13} strokeWidth={2} className="text-accent flex-shrink-0" />
                  Unterlagen-Checkliste
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Rechtliches */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-5">
              Rechtliches
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li><Link href="/impressum"  className="text-white/60 hover:text-white transition-colors duration-[120ms]">Impressum</Link></li>
              <li><Link href="/datenschutz"className="text-white/60 hover:text-white transition-colors duration-[120ms]">Datenschutz</Link></li>
              <li><Link href="/agb"        className="text-white/60 hover:text-white transition-colors duration-[120ms]">AGB</Link></li>
              <li><Link href="/widerruf"   className="text-white/60 hover:text-white transition-colors duration-[120ms]">Widerrufsbelehrung</Link></li>
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
                van Valkenburg GmbH
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} strokeWidth={2} className="text-accent mt-0.5 flex-shrink-0" />
                <a href="mailto:info@mein-baupotenzial.de" className="hover:text-white transition-colors duration-[120ms]">
                  info@mein-baupotenzial.de
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} strokeWidth={2} className="text-accent mt-0.5 flex-shrink-0" />
                <a href="tel:+4921112345670" className="hover:text-white transition-colors duration-[120ms]">
                  +49 (0) 211 1234567
                </a>
              </li>
              <li className="mt-4">
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
              src="/footer logo.png"
              alt="mein-baupotenzial.de Logo"
              className="h-12 w-auto object-contain opacity-80"
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
            <p>© {year} van Valkenburg GmbH. Alle Rechte vorbehalten.</p>
            <p>Entwickelt für den deutschen Immobilienmarkt.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

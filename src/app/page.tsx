'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const faqs = [
  // A) Leistung & Ergebnis
  { q: "Was genau bekomme ich?", a: "Sie erhalten je nach Paket einen strukturierten PDF-Report mit Einschätzung zu Planungsrecht, realistischen Optionen (Neubau/Nachverdichtung/Aufstockung/Teilung) und einer klaren Handlungsempfehlung. Ab Potenzialanalyse zusätzlich ein Ergebnisgespräch." },
  { q: "Ist das eine Baugenehmigung oder Bauvorbescheid?", a: "Nein. Es handelt sich um eine Machbarkeits-Vorprüfung/Analyse. Für rechtsverbindliche Klärungen ist eine Bauvoranfrage/Bauvorbescheid beim Bauamt erforderlich." },
  { q: "Wie belastbar ist die Einschätzung?", a: "So belastbar, wie es die vorliegenden Unterlagen und die örtlichen Rahmenbedingungen erlauben. Wir kennzeichnen Annahmen, Risiken und offene Punkte klar." },
  { q: "Welche Varianten betrachtet ihr?", a: "Abhängig vom Paket und Ihrem Ziel: Neubau (EFH/MFH), Nachverdichtung, Aufstockung, Teilung. In der Machbarkeitsstudie typischerweise mehrere Varianten." },
  { q: "Bekomme ich Zeichnungen/Skizzen?", a: "Je nach Paket: in höheren Paketen schematische Skizzen/Lageplan-Varianten, keine Genehmigungsplanung." },
  { q: "Bekommt ihr auch eine Einschätzung zu Stellplätzen?", a: "Plausibilisierung/Vorschlag – die konkrete Stellplatzsatzung/Abstimmung erfolgt im Planungsprozess." },
  { q: "Erstellt ihr auch Bauanträge?", a: "Nicht im Rahmen des Onepager-Produkts. Optional kann nach der Analyse ein separates Angebot für Planung/Antrag erfolgen." },
  
  // B) Dauer & Ablauf
  { q: "Wie läuft der Prozess ab?", a: "Schritt-für-Schritt Formular → Zusammenfassung → Paketauswahl → Zahlung → Bearbeitung → PDF + (ab Potenzialanalyse) Call." },
  { q: "Wie schnell bekomme ich das Ergebnis?", a: "Abhängig vom Paket und Datenlage; die konkrete Bearbeitungszeit wird im Checkout angezeigt." },
  { q: "Kann ich nachträglich Unterlagen nachreichen?", a: "Ja. Sie erhalten nach Bestellung einen Link/Anleitung zum Nachreichen." },
  { q: "Was passiert, wenn ich den Prozess abbreche?", a: "Ihre Eingaben werden (sofern zugestimmt) zwischengespeichert, damit wir den Fall intern sehen und Sie optional fortsetzen können." },
  
  // C) Daten & Unterlagen
  { q: "Welche Unterlagen sind ideal?", a: "Flurkarte/Lageplan, Bebauungsplan (falls vorhanden), Fotos, ggf. Bestandspläne." },
  { q: "Ich kenne mein Flurstück nicht – geht’s trotzdem?", a: "Ja. Adresse und Fotos reichen häufig für eine erste Einordnung." },
  { q: "Sind meine Daten sicher?", a: "Wir verarbeiten Daten DSGVO-konform. Details finden Sie in der Datenschutzerklärung." },
  { q: "Kann ich sensible Dokumente (Grundbuch) auch weglassen?", a: "Ja. Reichen Sie nur ein, was Sie möchten. Wir sagen Ihnen, wenn etwas Entscheidendes fehlt." },
  
  // D) Zahlung, Preise, Promocode
  { q: "Welche Zahlungsmethoden gibt es?", a: "PayPal oder Überweisung." },
  { q: "Wann startet ihr mit der Analyse?", a: "Erst nach Zahlungseingang." },
  { q: "Wie funktioniert der Promocode?", a: "Der Promocode gilt ausschließlich für den Quick-Check und reduziert den Preis auf 0 €." },
  { q: "Kann ich den Promocode für Potenzialanalyse/Machbarkeitsstudie nutzen?", a: "Nein." },
  { q: "Erhalte ich eine Rechnung?", a: "Ja, automatisch nach Bestellung/Zahlung (je nach Zahlungsart)." },
  
  // E) Rechtliche Einordnung (behördensicher)
  { q: "Was ist der Unterschied zwischen B-Plan, §34 und §35?", a: "Kurz erklärt: B-Plan = festgesetzte Regeln; §34 = Einfügungsgebot im Innenbereich; §35 = Außenbereich mit stark eingeschränkter Bebaubarkeit. Wir ordnen Ihren Fall ein." },
  { q: "Was, wenn es eine Baulast oder Dienstbarkeit gibt?", a: "Wenn bekannt/unterlagenbasiert, weisen wir darauf hin und erklären die Relevanz." },
  { q: "Übernehmt ihr eine Gewähr für Genehmigungsfähigkeit?", a: "Nein. Genehmigungen erteilt ausschließlich die zuständige Behörde." },
  
  // F) Nächste Schritte nach der Analyse
  { q: "Was ist typischerweise der nächste Schritt?", a: "Häufig: Bauvoranfrage/Bauvorbescheid, Vermessung, Architektenvorentwurf, Gespräche mit Bauamt." },
  { q: "Könnt ihr mich danach weiter begleiten?", a: "Ja, optional – je nach Projekt kann ein individuelles Angebot folgen." }
];

export default function HomePage() {
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [visibleFaqCount, setVisibleFaqCount] = useState(5);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const displayedFaqs = filteredFaqs.slice(0, visibleFaqCount);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      
      <main className="flex-grow">
        {/* SECTION 1: HERO */}
        <section className="relative pt-20 pb-20 overflow-hidden bg-surface-bright border-b border-surface-dim">
          <div className="max-w-7xl mx-auto px-4 md:px-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 bg-secondary-container text-secondary px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Offizielle planungsrechtliche Analyse
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 leading-tight font-sans">
                Was ist auf Ihrem Grundstück möglich?
              </h1>
              <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">
                Wir prüfen, was auf Ihrem Grundstück planungsrechtlich grundsätzlich möglich ist – und was der nächste sinnvolle Schritt ist.
              </p>
              <p className="text-xs font-bold text-secondary mb-8 uppercase tracking-widest">
                Neubau • Nachverdichtung • Aufstockung • Teilung
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/analyse" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-base hover:opacity-90 transition-opacity shadow-lg">
                  Jetzt starten
                </Link>
                <a href="#musterbericht" className="bg-surface-white border border-surface-dim text-primary px-8 py-4 rounded-xl font-bold text-base hover:bg-surface-bright transition-colors">
                  Beispielbericht ansehen
                </a>
              </div>
              <div className="flex flex-wrap gap-6 text-on-surface-variant text-xs font-medium">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary">check_circle</span> Fixpreis</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary">check_circle</span> PDF-Report + Call</span>
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary">check_circle</span> Machbarkeits-Vorprüfung</span>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="bg-surface-white p-6 rounded-2xl shadow-xl border border-surface-dim">
                <img 
                  alt="Property Analysis Visual" 
                  className="rounded-lg w-full h-[450px] object-cover" 
                  src="/hero.jpg"
                />
                <div className="absolute -bottom-4 -left-4 bg-secondary text-white p-4 rounded-xl shadow-lg max-w-[220px]">
                  <p className="text-[10px] font-bold opacity-80 mb-1">BEISPIEL</p>
                  <p className="text-xs font-bold leading-snug">Detaillierte Flurkartenauszüge &amp; Bebauungspläne</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TRUST BAR */}
        <div className="bg-primary py-8 text-white border-b border-primary-container">
          <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-wrap justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary">gpp_good</span>
              <span className="text-sm font-semibold">DSGVO-Konform (Server in DE)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary">lock</span>
              <span className="text-sm font-semibold">Sichere Dateneingabe</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary">description</span>
              <span className="text-sm font-semibold">Detaillierter PDF-Bericht</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary">support_agent</span>
              <span className="text-sm font-semibold">Persönliche Beratung (ab Potenzial)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary">payments</span>
              <span className="text-sm font-semibold">Sicher mit PayPal &amp; Bank</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: BENEFITS */}
        <section className="py-20 bg-surface-white border-b border-surface-dim" id="ueber-uns">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-primary mb-4 font-sans">Warum mein-baupotenzial.de?</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-base">
                Expertise trifft Effizienz. Wir übersetzen komplexe Gesetzestexte und Bebauungspläne in klare Immobilien-Strategien.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group p-8 rounded-2xl border border-surface-dim hover:border-secondary transition-all duration-300 hover:shadow-lg bg-surface-bright">
                <div className="w-12 h-12 bg-secondary-container text-secondary rounded-lg flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl font-bold">gavel</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-4">Planungsrecht verständlich eingeordnet</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Wir analysieren den Bebauungsplan oder die Umgebungsbebauung nach § 34 BauGB und fassen die Kernpunkte prägnant für Sie zusammen.
                </p>
              </div>
              {/* Card 2 */}
              <div className="group p-8 rounded-2xl border border-surface-dim hover:border-secondary transition-all duration-300 hover:shadow-lg bg-surface-bright">
                <div className="w-12 h-12 bg-secondary-container text-secondary rounded-lg flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl font-bold">insights</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-4">Realistische Optionen erkennen</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Was ist Theorie, was ist Praxis? Wir zeigen Ihnen auf, welche Bauvolumina auf Ihrem Grundstück tatsächlich genehmigungsfähig erscheinen.
                </p>
              </div>
              {/* Card 3 */}
              <div className="group p-8 rounded-2xl border border-surface-dim hover:border-secondary transition-all duration-300 hover:shadow-lg bg-surface-bright">
                <div className="w-12 h-12 bg-secondary-container text-secondary rounded-lg flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl font-bold">near_me</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-4">Klare nächste Schritte erhalten</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Kein Rätselraten mehr. Am Ende unserer Analyse wissen Sie genau, ob sich ein Bauvorbescheid lohnt oder wie Sie die Teilung angehen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PROCESS & WIZARD PREVIEW */}
        <section className="py-20 bg-[#F5F7FA] border-b border-surface-dim">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-primary mb-6">So funktioniert die Analyse</h2>
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">Grundstück & Vorhaben erfassen</h4>
                      <p className="text-on-surface-variant text-sm mt-1">Beantworten Sie einige gezielte Fragen zu Ihrem Grundstück, Ihrer Eigentumssituation und Ihren Plänen.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">Unterlagen hochladen</h4>
                      <p className="text-on-surface-variant text-sm mt-1">Laden Sie Lagepläne, Fotos, Grundbuchauszüge und weitere relevante Dokumente für eine fundierte Bewertung hoch.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">Analysepaket auswählen</h4>
                      <p className="text-on-surface-variant text-sm mt-1">Wählen Sie das Analysepaket, das am besten zu Ihrem Vorhaben und Informationsbedarf passt.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-sm">Ergebnisse erhalten</h4>
                      <p className="text-on-surface-variant text-sm mt-1">Sie erhalten einen professionellen PDF-Bericht mit Einschätzungen, Potenzialen, Risiken und konkreten Handlungsempfehlungen.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-white rounded-2xl shadow-xl border border-surface-dim overflow-hidden">
                <div className="bg-primary p-4 flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="text-[10px] text-white/75 bg-primary-container px-3 py-1 rounded-full flex-grow text-center">app.mein-baupotenzial.de/analyse</div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">1</div>
                      <div className="h-0.5 w-12 bg-secondary"></div>
                      <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs font-bold">2</div>
                      <div className="h-0.5 w-12 bg-surface-container"></div>
                      <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs font-bold">...</div>
                    </div>
                    <div className="text-xs text-on-surface-variant font-semibold">Schritt 1 von 10</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-1/3 bg-surface-dim rounded"></div>
                    <div className="h-10 w-full border border-surface-dim rounded-lg bg-surface-bright flex items-center px-3 text-xs text-primary font-medium">Bebauungspotenzial prüfen</div>
                    <div className="h-4 w-1/2 bg-surface-dim rounded mt-6"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-10 border border-secondary bg-secondary-container rounded-lg flex items-center px-3 text-xs text-secondary font-bold">Neubau</div>
                      <div className="h-10 border border-surface-dim rounded-lg flex items-center px-3 text-xs text-on-surface-variant">Aufstockung</div>
                    </div>
                    <div className="pt-6">
                      <Link href="/analyse" className="h-12 w-full bg-primary rounded-xl flex items-center justify-center text-on-primary text-sm font-bold hover:opacity-95 transition-opacity">
                        Weiter zum nächsten Schritt
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: 4-STEP PROCESS */}
        <section className="py-20 bg-surface-white border-b border-surface-dim">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <h2 className="text-3xl font-extrabold text-primary mb-16 text-center">In 4 Schritten zum Ergebnis</h2>
            <div className="relative flex flex-col md:flex-row gap-8 justify-between items-start">
              <div className="absolute top-10 left-8 right-8 h-0.5 bg-surface-dim hidden md:block z-0"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center md:w-1/4">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg mb-6 border-4 border-surface-white shadow-md">1</div>
                <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">Daten eingeben</h4>
                <p className="text-xs text-on-surface-variant px-4">Geben Sie die wichtigsten Informationen zu Ihrem Grundstück ein.</p>
              </div>
              
              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center md:w-1/4">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg mb-6 border-4 border-surface-white shadow-md">2</div>
                <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">Dokumente hochladen</h4>
                <p className="text-xs text-on-surface-variant px-4">Laden Sie Pläne, Fotos und relevante Unterlagen verschlüsselt hoch.</p>
              </div>
              
              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center md:w-1/4">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg mb-6 border-4 border-surface-white shadow-md">3</div>
                <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">Paket wählen</h4>
                <p className="text-xs text-on-surface-variant px-4">Wählen Sie das passende Paket und schließen Sie die Bestellung ab.</p>
              </div>
              
              {/* Step 4 */}
              <div className="relative z-10 flex flex-col items-center text-center md:w-1/4">
                <div className="w-16 h-16 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg mb-6 border-4 border-surface-white shadow-md">
                  <span className="material-symbols-outlined text-white">flag</span>
                </div>
                <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">Ergebnis erhalten</h4>
                <p className="text-xs text-on-surface-variant px-4">Sie erhalten einen detaillierten PDF-Report (ab Potenzialanalyse inkl. Abstimmungsgespräch).</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: WHY TRUST US */}
        <section className="py-20 bg-surface-bright border-b border-surface-dim">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-primary mb-4">Warum Eigentümer uns vertrauen</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-sm">
                Fundierte Einschätzungen, klare Handlungsempfehlungen und ein professioneller Analyseprozess.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-surface-white p-8 rounded-2xl shadow-sm border border-surface-dim">
                <div className="w-12 h-12 bg-primary-container text-white flex items-center justify-center rounded-xl mb-6">
                  <span className="material-symbols-outlined text-secondary">balance</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-4 font-sans">Planungsrechtliche Einordnung</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Präzise Analyse von Bebauungsplänen, § 34 BauGB (Einfügungsgebot) und weiteren Rahmenbedingungen wie Erhaltungssatzungen.
                </p>
              </div>
              <div className="bg-surface-white p-8 rounded-2xl shadow-sm border border-surface-dim">
                <div className="w-12 h-12 bg-primary-container text-white flex items-center justify-center rounded-xl mb-6">
                  <span className="material-symbols-outlined text-secondary">architecture</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-4 font-sans">Realistische Potenziale</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Ob Neubau, Nachverdichtung, Aufstockung oder Grundstücksteilung – wir bewerten Ihre Optionen verständlich und städtebaulich fundiert.
                </p>
              </div>
              <div className="bg-surface-white p-8 rounded-2xl shadow-sm border border-surface-dim">
                <div className="w-12 h-12 bg-primary-container text-white flex items-center justify-center rounded-xl mb-6">
                  <span className="material-symbols-outlined text-secondary">ads_click</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-4 font-sans">Klare nächste Schritte</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Sie erhalten konkrete Handlungsempfehlungen für das weitere Vorgehen mit dem Bauamt oder Planern, statt vager Aussagen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: SAMPLE ANALYSIS REPORT */}
        <section className="py-20 bg-surface-white border-b border-surface-dim" id="musterbericht">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2">
                <div className="relative bg-[#F5F7FA] p-4 rounded-3xl border border-surface-dim shadow-xl">
                  <img 
                    alt="Beispiel Bericht Preview" 
                    className="rounded-2xl w-full h-auto shadow-inner" 
                    src="/image2.png"
                  />
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl pointer-events-none"></div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-extrabold text-primary mb-4 font-sans">Beispiel einer Analyse</h2>
                <p className="text-base text-on-surface-variant mb-8 leading-relaxed">
                  Sehen Sie vorab, wie eine professionelle Grundstücksanalyse aufgebaut ist und welche Auswertungen geliefert werden.
                </p>
                <ul className="space-y-4 mb-10 text-sm font-semibold text-primary">
                  <li className="flex items-center gap-3">
                    <span className="text-secondary font-bold">✓</span> Planungsrechtliche Bewertung nach BauGB
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-secondary font-bold">✓</span> Analyse von Chancen &amp; Risiken
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-secondary font-bold">✓</span> Konkrete städtebauliche Handlungsempfehlungen
                  </li>
                </ul>
                <a 
                  href="/sample-report.pdf" 
                  target="_blank"
                  className="inline-block bg-surface-white border-2 border-secondary text-secondary px-8 py-3 rounded-xl font-bold hover:bg-secondary-container transition-colors text-sm"
                >
                  Beispielbericht ansehen
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: PRICING PACKAGES */}
        <section className="py-20 bg-surface-bright border-b border-surface-dim" id="preise">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-primary mb-4 font-sans">Unsere Tarife im Überblick</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-base">
                Wählen Sie das passende Leistungspaket für Ihre Grundstücksanalyse. Alle Preise verstehen sich zuzüglich der gesetzlichen Mehrwertsteuer.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Package 1 */}
              <div className="bg-surface-white rounded-2xl border border-surface-dim p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">Quick Check</h3>
                  <p className="text-xs text-on-surface-variant mb-6">Für eine schnelle Ersteinschätzung</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-primary">189 €</span>
                    <span className="text-xs text-on-surface-variant ml-2">+ 19% MwSt.</span>
                  </div>
                  <ul className="space-y-3 text-sm text-on-surface-variant border-t border-surface-dim pt-6 mb-8">
                    <li className="flex items-center gap-2">✓ Planungsrechtliche Vorprüfung</li>
                    <li className="flex items-center gap-2">✓ Prüfung von BauGB § 34</li>
                    <li className="flex items-center gap-2">✓ PDF-Kurzbericht</li>
                    <li className="flex items-center gap-2 text-surface-dim">✗ Telefonische Beratung</li>
                    <li className="flex items-center gap-2 text-surface-dim">✗ Detailliertes Gutachten</li>
                  </ul>
                </div>
                <Link 
                  href="/analyse?package=QUICK_CHECK" 
                  className="w-full py-3 rounded-xl border border-primary text-primary font-bold text-center text-sm hover:bg-surface-bright transition-colors"
                >
                  Quick Check wählen
                </Link>
              </div>

              {/* Package 2 */}
              <div className="bg-surface-white rounded-2xl border-2 border-secondary p-8 flex flex-col justify-between relative shadow-md hover:shadow-xl transition-shadow">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Beliebt
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">Potenzialanalyse</h3>
                  <p className="text-xs text-on-surface-variant mb-6">Umfassende Prüfung inkl. Fachgespräch</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-primary">490 €</span>
                    <span className="text-xs text-on-surface-variant ml-2">+ 19% MwSt.</span>
                  </div>
                  <ul className="space-y-3 text-sm text-on-surface-variant border-t border-surface-dim pt-6 mb-8">
                    <li className="flex items-center gap-2">✓ Planungsrechtliche Prüfung nach BauGB</li>
                    <li className="flex items-center gap-2">✓ Ermittlung des maximalen Bauvolumens</li>
                    <li className="flex items-center gap-2">✓ Detaillierter PDF-Report</li>
                    <li className="flex items-center gap-2">✓ 30 Min. telefonische Beratung/Video-Call</li>
                    <li className="flex items-center gap-2">✓ Handlungsempfehlung für Bauvorbescheid</li>
                  </ul>
                </div>
                <Link 
                  href="/analyse?package=POTENTIAL_ANALYSIS" 
                  className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-center text-sm hover:opacity-90 transition-opacity shadow"
                >
                  Potenzialanalyse wählen
                </Link>
              </div>

              {/* Package 3 */}
              <div className="bg-surface-white rounded-2xl border border-surface-dim p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">Machbarkeitsstudie</h3>
                  <p className="text-xs text-on-surface-variant mb-6">Für komplexe Bauvorhaben &amp; Projektentwickler</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-primary">2.490 €</span>
                    <span className="text-xs text-on-surface-variant ml-2">+ 19% MwSt.</span>
                  </div>
                  <ul className="space-y-3 text-sm text-on-surface-variant border-t border-surface-dim pt-6 mb-8">
                    <li className="flex items-center gap-2">✓ Vollumfängliche planungsrechtliche Analyse</li>
                    <li className="flex items-center gap-2">✓ Städtebauliche Skizzen &amp; Massenstudien</li>
                    <li className="flex items-center gap-2">✓ Ausführlicher Gutachterbericht</li>
                    <li className="flex items-center gap-2">✓ 60 Min. Beratung durch Fachexperten</li>
                    <li className="flex items-center gap-2">✓ Behördenabstimmung &amp; Vorbescheidbegleitung</li>
                  </ul>
                </div>
                <Link 
                  href="/analyse?package=FEASIBILITY_STUDY" 
                  className="w-full py-3 rounded-xl border border-primary text-primary font-bold text-center text-sm hover:bg-surface-bright transition-colors"
                >
                  Machbarkeitsstudie wählen
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: FAQ ACCORDION */}
        <section className="py-20 bg-surface-white border-b border-surface-dim" id="faq">
          <div className="max-w-[800px] mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-primary mb-6">Häufig gestellte Fragen</h2>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-surface-dim focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-background text-sm text-primary font-medium"
                  placeholder="Fragen durchsuchen..."
                  value={faqSearch}
                  onChange={(e) => {
                    setFaqSearch(e.target.value);
                    setVisibleFaqCount(5);
                    setOpenFaqIndex(null);
                  }}
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              </div>
            </div>
            
            <div className="space-y-1 border-t border-surface-dim">
              {displayedFaqs.length > 0 ? (
                displayedFaqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div className="border-b border-surface-dim" key={index}>
                      <button 
                        className="w-full py-5 flex justify-between items-center text-left focus:outline-none group"
                        onClick={() => toggleFaq(index)}
                      >
                        <span className="text-sm md:text-base font-bold text-primary group-hover:text-secondary transition-colors">{faq.q}</span>
                        <span 
                          className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-secondary' : 'text-on-surface-variant'}`}
                        >
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div className="pb-5 text-sm leading-relaxed text-on-surface-variant">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-on-surface-variant text-sm">
                  Keine Ergebnisse für Ihre Suche gefunden.
                </div>
              )}
            </div>

            {visibleFaqCount < filteredFaqs.length && (
              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={() => setVisibleFaqCount(prev => prev + 5)}
                  className="bg-primary text-on-primary px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Mehr laden
                </button>
              </div>
            )}
            
            <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-10 md:p-14 text-center shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-3xl text-secondary">support_agent</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3">Ihre Frage wurde nicht beantwortet?</h3>
                <p className="text-sm text-white/70 mb-8 max-w-md mx-auto">Unser Expertenteam steht Ihnen persönlich zur Verfügung – schnell, kompetent und unverbindlich.</p>
                <Link href="/kontakt" className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-secondary/90 transition-colors shadow-lg">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                  Kontakt aufnehmen
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

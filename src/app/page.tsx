'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  BadgeCheck,
  Building2,
  BookOpen,
  Scale,
  UserCheck,
  Clock,
  FileText,
  Map,
  BarChart2,
  Compass,
  PenLine,
  Search,
  Shield,
  Rss,
  Lightbulb,
  TrendingUp,
  Zap,
  CheckCircle2,
  PhoneCall,
  ChevronDown,
  Flag,
  Check,
  PlayCircle,
} from 'lucide-react';

// Load wizard client-side only (uses localStorage, useRouter)
const HomeWizard = dynamic(() => import('@/components/HomeWizard'), { ssr: false });

// ─────────────────────────────────────────────────────────────────
// FAQ DATA — 40 SEO/GEO/AI-Overviews-optimised
// ─────────────────────────────────────────────────────────────────
const faqs = [
  // A) Was ist eine Baupotenzialanalyse?
  { q: 'Was ist eine Baupotenzialanalyse?', a: 'Eine Baupotenzialanalyse ist eine fachliche Vorprüfung, die zeigt, welche Bebauung auf einem Grundstück planungsrechtlich grundsätzlich möglich ist. Sie bewertet Faktoren wie Bebauungsplan, § 34 BauGB, Grundflächenzahl, Geschossflächenzahl und städtebauliche Rahmenbedingungen.' },
  { q: 'Für wen ist eine Baupotenzialanalyse sinnvoll?', a: 'Für Grundstückseigentümer, die wissen wollen, ob Nachverdichtung, Aufstockung, Teilung oder Neubau möglich ist – sowie für Käufer vor dem Erwerb, Erbengemeinschaften, Investoren und Projektentwickler.' },
  { q: 'Was ist der Unterschied zwischen Baupotenzialanalyse und Baugenehmigung?', a: 'Die Baupotenzialanalyse ist eine fachliche Voreinschätzung auf Basis des geltenden Planungsrechts. Eine Baugenehmigung ist ein rechtsverbindlicher Bescheid, der nur von der zuständigen Bauaufsichtsbehörde erteilt werden kann.' },
  { q: 'Kann ich die Analyse als Grundlage für eine Kaufentscheidung nutzen?', a: 'Ja. Die Analyse liefert Ihnen eine fundierte Einschätzung des tatsächlichen Entwicklungspotenzials – ideal als Entscheidungshilfe vor einem Kauf oder Verkauf.' },
  { q: 'Was unterscheidet mein-baupotenzial.de von einem klassischen Architekten?', a: 'Wir liefern eine rein planungsrechtliche Vorprüfung – ohne Planungsauftrag, ohne Interessenkonflikt, unabhängig und auf das Wesentliche fokussiert. Unsere Experten haben über 40 Jahre Erfahrung in der städtebaulichen Beratung.' },
  // B) Planungsrechtliche Grundlagen
  { q: 'Was ist der Bebauungsplan und warum ist er wichtig?', a: 'Der Bebauungsplan (B-Plan) legt rechtsverbindlich fest, was auf einem Grundstück gebaut werden darf – z. B. Grundflächenzahl, Geschossflächenzahl, Bauweise, Dachform. Er ist die wichtigste Grundlage unserer Analyse.' },
  { q: 'Was gilt, wenn es keinen Bebauungsplan gibt (§ 34 BauGB)?', a: 'In Gebieten ohne B-Plan gilt das sogenannte Einfügungsgebot: Ein Vorhaben ist zulässig, wenn es sich nach Art und Maß der Nutzung, Bauweise und überbaubarer Grundstücksfläche in die Eigenart der näheren Umgebung einfügt. Wir analysieren das konkret für Ihr Grundstück.' },
  { q: 'Was bedeutet Grundflächenzahl (GRZ) und Geschossflächenzahl (GFZ)?', a: 'Die GRZ gibt an, welcher Anteil des Grundstücks bebaut werden darf (z. B. 0,4 = 40 %). Die GFZ gibt das Verhältnis der Gesamtgeschossfläche zur Grundstücksfläche an. Beide Werte bestimmen das realisierbare Bauvolumen.' },
  { q: 'Was ist § 35 BauGB und warum ist er relevant?', a: '§ 35 BauGB regelt Vorhaben im Außenbereich. Dort ist Bebauung stark eingeschränkt und im Wesentlichen nur für privilegierte Vorhaben (z. B. Landwirtschaft) zulässig. Wir prüfen, ob Ihr Grundstück Innen- oder Außenbereich ist.' },
  { q: 'Was ist eine Erhaltungssatzung und was bedeutet sie für mein Grundstück?', a: 'Eine Erhaltungssatzung schützt bestimmte Gebiete vor Veränderungen, die den Charakter beeinträchtigen – z. B. in Milieuschutzgebieten. Sie kann Nachverdichtung oder Aufstockungen einschränken. Wir prüfen das im Rahmen unserer Analyse.' },
  // C) Leistung & Ergebnis
  { q: 'Was genau bekomme ich mit der Analyse?', a: 'Je nach gewähltem Paket erhalten Sie einen strukturierten PDF-Report mit planungsrechtlicher Einordnung, realistischen Entwicklungsoptionen (Neubau, Nachverdichtung, Aufstockung, Teilung) und einer klaren Handlungsempfehlung. Ab der Potenzialanalyse inklusive persönlichem Expertengespräch.' },
  { q: 'Was ist der Unterschied zwischen QuickCheck, Potenzialanalyse und Machbarkeitsstudie?', a: 'QuickCheck (€249): schnelle planungsrechtliche Ersteinschätzung in 3 Werktagen, ohne Gespräch. Potenzialanalyse (€690): vollumfängliche Prüfung inkl. Bauvolumen und 30-minütigem Expertengespräch in 5 Werktagen. Machbarkeitsstudie (ab €3.490): für komplexe Projekte mit Skizzen, Massenstudien und Behördenabstimmung.' },
  { q: 'Ist die Einschätzung rechtlich bindend?', a: 'Nein. Unsere Analyse ist eine fachliche Voreinschätzung, keine rechtsverbindliche Entscheidung. Rechtsverbindliche Klärungen erfolgen durch einen Bauvorbescheid beim zuständigen Bauamt.' },
  { q: 'Wie belastbar ist das Ergebnis?', a: 'Unsere Analysen basieren auf dem aktuellen Planungsrecht und den eingereichten Unterlagen. Wir kennzeichnen Annahmen, Unsicherheiten und offene Punkte klar. Je besser die Unterlagenbasis, desto belastbarer das Ergebnis.' },
  { q: 'Welche Entwicklungsoptionen betrachtet ihr?', a: 'Abhängig von Ihrem Grundstück und dem gewählten Paket: Neubau (EFH/MFH), Nachverdichtung (Lückenschluss, Hinterhaus), Aufstockung, Grundstücksteilung, Ersatzneubau. In der Machbarkeitsstudie typischerweise mehrere Varianten.' },
  { q: 'Erstellt ihr auch Zeichnungen oder Skizzen?', a: 'Schematische Skizzen und Lagepläne sind Teil der Machbarkeitsstudie. Der QuickCheck und die Potenzialanalyse liefern keinen Architekturentwurf – dafür aber eine klare Einschätzung, ob ein solcher Schritt sinnvoll ist.' },
  // D) Ablauf & Prozess
  { q: 'Wie läuft der Prozess ab?', a: 'Sie beantworten ein strukturiertes Formular zu Ihrem Grundstück → laden optionale Unterlagen hoch → wählen Ihr Paket → schließen die Zahlung ab → unser Expertenteam analysiert und liefert Ihr Ergebnis fristgerecht.' },
  { q: 'Wie schnell erhalte ich das Ergebnis?', a: 'QuickCheck: 3 Werktage. Potenzialanalyse: 5 Werktage. Machbarkeitsstudie: 10–15 Werktage. Die Bearbeitung beginnt nach Zahlungseingang.' },
  { q: 'Kann ich Unterlagen nachträglich einreichen?', a: 'Ja. Sie erhalten nach der Bestellung eine Anleitung zum Nachreichen von Unterlagen. Fehlende Dokumente können die Bearbeitungszeit geringfügig verlängern.' },
  { q: 'Was passiert, wenn ich den Prozess mittendrin abbreche?', a: 'Ihre Eingaben werden (bei entsprechender Zustimmung) zwischengespeichert, sodass Sie den Vorgang zu einem späteren Zeitpunkt fortsetzen können.' },
  // E) Unterlagen & Daten
  { q: 'Welche Unterlagen benötige ich für die Analyse?', a: 'Ideal sind: Flurkarte/Lageplan, Bebauungsplan (falls vorhanden), aktuelle Fotos, Grundrisse oder Bestandspläne. Für eine erste Einschätzung reichen auch Adresse und Fotos.' },
  { q: 'Ich kenne mein Flurstück nicht – kann ich trotzdem eine Analyse anfragen?', a: 'Ja. Adresse und Fotos genügen häufig für eine erste planungsrechtliche Einordnung. Wir teilen Ihnen mit, wenn entscheidende Informationen fehlen.' },
  { q: 'Muss ich einen Grundbuchauszug einreichen?', a: 'Nein, das ist optional. Sie reichen nur ein, was Sie möchten. Grundbuchinformationen können in bestimmten Fällen die Analyse präzisieren (z. B. bei Dienstbarkeiten).' },
  { q: 'Sind meine Daten sicher?', a: 'Ja. Alle Daten werden DSGVO-konform auf Servern in Deutschland verarbeitet. Ihre Unterlagen werden vertraulich behandelt und nicht an Dritte weitergegeben.' },
  { q: 'Was passiert mit meinen Daten nach Abschluss der Analyse?', a: 'Ihre Daten werden gemäß unserer Datenschutzerklärung aufbewahrt und nach gesetzlich vorgeschriebenen Fristen gelöscht. Details entnehmen Sie unserer Datenschutzerklärung.' },
  // F) Zahlung & Preise
  { q: 'Welche Zahlungsmethoden werden akzeptiert?', a: 'Sie können per Überweisung oder PayPal bezahlen. Die Bearbeitung startet nach Zahlungseingang.' },
  { q: 'Wann beginnt die Bearbeitung nach der Bestellung?', a: 'Direkt nach Zahlungseingang. Bei Überweisung nach Eingang auf unserem Konto, bei PayPal sofort nach Zahlungsbestätigung.' },
  { q: 'Wie funktioniert der Promocode?', a: 'Promocodes gelten ausschließlich für den QuickCheck und reduzieren den Preis entsprechend. Sie können den Code im Checkout eingeben.' },
  { q: 'Erhalte ich eine Rechnung?', a: 'Ja. Sie erhalten nach Abschluss der Bestellung automatisch eine Rechnung per E-Mail.' },
  { q: 'Gibt es eine Rückgabegarantie oder ein Widerrufsrecht?', a: 'Informationen zum Widerrufsrecht finden Sie in unserer Widerrufsbelehrung. Bei digitalen Leistungen, die mit Zustimmung vor Ablauf der Widerrufsfrist erbracht werden, erlischt das Widerrufsrecht.' },
  // G) Planungsrechtliche Sonderfälle
  { q: 'Was ist eine Baulast und wie wirkt sie sich aus?', a: 'Eine Baulast ist eine öffentlich-rechtliche Verpflichtung, die im Baulastenverzeichnis eingetragen ist – z. B. Abstandsflächen-Übernahme oder Wegerechte. Wir weisen auf bekannte Baulasten hin und erläutern deren Relevanz für Ihre Planung.' },
  { q: 'Was ist ein Bauvorbescheid und wann lohnt er sich?', a: 'Ein Bauvorbescheid (Bauvoranfrage) ist eine rechtsverbindliche Vorabantwort der Bauaufsichtsbehörde auf konkrete Planungsfragen. Er lohnt sich, wenn Sie vor größeren Investitionen Rechtssicherheit benötigen. Unsere Analyse zeigt, ob ein solcher Schritt sinnvoll ist.' },
  { q: 'Kann auf meinem Grundstück nachverdichtet werden?', a: 'Das hängt von der bestehenden Bebauung, dem Planungsrecht (B-Plan oder § 34), den noch vorhandenen GRZ/GFZ-Reserven und den Abstandsflächenregeln ab. Genau das prüft unsere Analyse für Sie.' },
  { q: 'Ist eine Grundstücksteilung immer möglich?', a: 'Nicht automatisch. Eine Teilung ist nur möglich, wenn beide entstehenden Grundstücke den planungsrechtlichen Mindestanforderungen entsprechen (z. B. Mindestgröße, Zufahrt, Bebaubarkeit). Wir prüfen das konkret.' },
  { q: 'Was ist der Unterschied zwischen Innenbereich und Außenbereich?', a: 'Der Innenbereich (§ 34 BauGB) umfasst zusammenhängend bebaute Ortsteile, wo neue Vorhaben sich in die Umgebungsbebauung einfügen müssen. Der Außenbereich (§ 35 BauGB) liegt jenseits der Bebauung, wo Bauvorhaben stark eingeschränkt sind.' },
  // H) Nach der Analyse
  { q: 'Was ist der typische nächste Schritt nach der Analyse?', a: 'Häufig: Bauvoranfrage/Bauvorbescheid beim Bauamt, Beauftragung eines Architekten für einen Vorentwurf, Gespräch mit dem Bauamt, Vermessungsantrag bei Teilung oder Weiterverkauf mit klarer Potenzialaussage.' },
  { q: 'Können Sie mich nach der Analyse weiter begleiten?', a: 'Ja, optional. Je nach Projekt können wir ein individuelles Angebot für weiterführende Beratungsleistungen erstellen – z. B. Begleitung bei der Bauvoranfrage oder städtebauliche Abstimmung.' },
  { q: 'Kann ich die Analyse für einen Verkauf nutzen?', a: 'Ja. Eine professionelle Baupotenzialanalyse ist ein starkes Verkaufsargument. Sie dokumentiert das Entwicklungspotenzial und gibt Kaufinteressenten Sicherheit – was den Verkaufspreis positiv beeinflussen kann.' },
  { q: 'Übernehmt ihr eine Gewähr für die Genehmigungsfähigkeit?', a: 'Nein. Genehmigungen erteilt ausschließlich die zuständige Bauaufsichtsbehörde. Unsere Analyse ist eine fachliche Einschätzung – keine Garantie für eine Genehmigung.' },
  { q: 'Wie erhalte ich meinen fertigen Report?', a: 'Der fertige PDF-Report wird Ihnen per E-Mail zugestellt. Ab der Potenzialanalyse vereinbaren wir zudem einen persönlichen Termin für das 30-minütige Ergebnisgespräch.' },
  { q: 'Kann ich nach Erhalt des Reports noch Fragen stellen?', a: 'Ja. Inhaltliche Rückfragen zum Report können Sie an unser Expertenteam richten. Für darüber hinausgehende Beratung können wir ein individuelles Angebot erstellen.' },
];

export default function HomePage() {
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [visibleFaqCount, setVisibleFaqCount] = useState(8);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );
  const displayedFaqs = filteredFaqs.slice(0, visibleFaqCount);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) setNewsletterSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-white">
      <Header />

      <main className="flex-grow">

        {/* ═══════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════ */}
        <section
          className="bg-surface-white border-b border-surface-dim"
          style={{ paddingTop: '80px', paddingBottom: '100px' }}
        >
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 grid md:grid-cols-[48%_52%] gap-16 items-center">

            {/* Left col */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-accent/40 text-accent px-4 py-1.5 rounded-full text-[13px] font-semibold mb-8 bg-accent-container">
                <BadgeCheck size={14} strokeWidth={2} />
                Über 40 Jahre Erfahrung · Unabhängig · Fachlich fundiert
              </div>

              <h1
                className="font-bold text-primary mb-6 leading-[1.1] tracking-tight"
                style={{ fontSize: 'clamp(32px, 4vw, 58px)' }}
              >
                Bevor Sie entscheiden, sollten Sie wissen, was Ihr Grundstück wirklich kann.
              </h1>

              <p className="text-[18px] text-on-surface-variant mb-8 leading-[1.6]" style={{ maxWidth: '52ch' }}>
                Möchten Sie wissen, ob Nachverdichtung, Aufstockung, Grundstücksteilung oder
                Neubau möglich ist? Unsere Baupotenzialanalyse schafft Klarheit — verständlich,
                unabhängig und auf Basis aktueller planungsrechtlicher Vorschriften.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium text-on-surface-variant mb-10">
                {[
                  'Über 40 Jahre Erfahrung',
                  'Spezialist für Nachverdichtung',
                  'Verständliche Handlungsempfehlungen',
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Check size={15} strokeWidth={2.5} className="text-secondary flex-shrink-0" />
                    {item}
                  </span>
                ))}
              </div>

              <Link
                href="/analyse"
                className="inline-flex items-center gap-2.5 bg-secondary text-on-secondary font-semibold text-[16px] hover:bg-cta-hover transition-colors duration-[120ms]"
                style={{ height: '56px', paddingLeft: '32px', paddingRight: '32px', borderRadius: '14px' }}
              >
                <Building2 size={18} strokeWidth={2} />
                Grundstück analysieren
              </Link>
            </div>

            {/* Right col — hero image */}
            <div className="relative hidden md:block">
              <div className="rounded-[18px] overflow-hidden shadow-card-hover">
                <img
                  alt="Grundstück analysieren – mein-baupotenzial.de"
                  className="w-full object-cover"
                  style={{ height: '480px', objectPosition: 'center 30%' }}
                  src="/hero.jpg"
                />
              </div>

              {/* Clean result card — no glassmorphism */}
              <div
                className="absolute bottom-6 right-6 rounded-[14px] p-5 bg-white shadow-card-hover"
                style={{ minWidth: '220px' }}
              >
                <p className="text-[11px] font-bold text-accent uppercase tracking-widest mb-3">
                  Analyseergebnis
                </p>
                <ul className="space-y-2 text-[14px] font-medium text-primary">
                  {[
                    'Nachverdichtung möglich',
                    'Grundstücksteilung prüfenswert',
                    'Bauvolumen ermittelt',
                    'Handlungsempfehlung enthalten',
                    'PDF-Report in 5 Werktagen',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check size={13} strokeWidth={2.5} className="text-secondary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 2 — TRUST BAR
        ═══════════════════════════════════════ */}
        <div className="bg-primary py-6 text-white border-b border-primary-container">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-wrap justify-between items-center gap-6">
            {[
              { Icon: BookOpen,  label: 'Über 40 Jahre Erfahrung' },
              { Icon: Scale,     label: 'Unabhängige Beurteilung' },
              { Icon: UserCheck, label: 'Persönliche Expertenauswertung' },
              { Icon: Clock,     label: 'Bearbeitung in 5 Werktagen' },
              { Icon: FileText,  label: 'Verständlicher PDF-Report' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 min-w-max">
                <Icon size={18} strokeWidth={2} className="text-accent" />
                <span className="text-[14px] font-medium text-white/80">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            SECTION 3 — WHY A BUILDING-POTENTIAL ANALYSIS?
        ═══════════════════════════════════════ */}
        <section className="py-[120px] bg-surface-white border-b border-surface-dim" id="wissen">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <div style={{ maxWidth: '60ch' }} className="mb-14 mx-auto text-center">
              <h2
                className="font-bold text-primary mb-6 leading-[1.15] tracking-tight"
                style={{ fontSize: 'clamp(28px, 3vw, 42px)' }}
              >
                Viele Grundstücke haben deutlich mehr Potenzial als ihre Eigentümer ahnen.
              </h2>
              <p className="text-[18px] text-on-surface-variant leading-[1.6]">
                Ob Nachverdichtung, Grundstücksteilung, Aufstockung oder Ersatzneubau — wertvolle
                Optionen bleiben oft ungenutzt, weil der planungsrechtliche Rahmen nicht bekannt ist.
                Unsere Analyse zeigt Ihnen, welche Optionen realistisch sind.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  Icon: Map,
                  title: 'Sie wissen, was rechtlich bebaubar ist.',
                  desc: 'Wir analysieren den Bebauungsplan, das Einfügungsgebot nach § 34 BauGB und alle relevanten Rahmenbedingungen — und fassen das Ergebnis verständlich zusammen.',
                },
                {
                  Icon: BarChart2,
                  title: 'Sie erkennen das Potenzial Ihres Grundstücks.',
                  desc: 'Ob Neubau, Aufstockung, Hinterhausbebauung oder Teilung — wir zeigen Ihnen, welche Optionen auf Ihrem Grundstück tatsächlich denkbar sind.',
                },
                {
                  Icon: Compass,
                  title: 'Sie treffen die richtige Entscheidung.',
                  desc: 'Mit einer klaren Handlungsempfehlung wissen Sie, ob ein Bauvorbescheid sinnvoll ist, ob ein Verkauf mehr Sinn macht oder welcher Schritt als nächstes folgen sollte.',
                },
              ].map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-surface-bright p-8 rounded-[18px] shadow-card hover:shadow-card-hover transition-shadow duration-[250ms]"
                >
                  <div className="w-11 h-11 bg-white rounded-[12px] flex items-center justify-center mb-6 shadow-soft">
                    <Icon size={20} strokeWidth={2} className="text-secondary" />
                  </div>
                  <h3 className="text-[18px] font-semibold text-primary mb-3 leading-snug">{title}</h3>
                  <p className="text-[15px] text-on-surface-variant leading-[1.6]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 4 — WHY OWNERS TRUST US
        ═══════════════════════════════════════ */}
        <section className="py-[120px] bg-surface-bright border-b border-surface-dim">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <div className="text-center mb-14">
              <h2
                className="font-bold text-primary mb-6 leading-[1.15] tracking-tight"
                style={{ fontSize: 'clamp(26px, 3vw, 42px)' }}
              >
                Warum Eigentümer uns vertrauen
              </h2>
              <p className="text-[18px] text-on-surface-variant mx-auto leading-[1.6]" style={{ maxWidth: '52ch' }}>
                Fundierte Einschätzungen, klare Handlungsempfehlungen und ein professioneller
                Analyseprozess — seit über vier Jahrzehnten.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { Icon: BookOpen,  stat: '40+',  unit: 'Jahre',  label: 'Erfahrung in der\nstädtebaulichen Beratung' },
                { Icon: Scale,     stat: '100 %',unit: '',       label: 'Unabhängige Beurteilung —\nohne Interessenkonflikt' },
                { Icon: UserCheck, stat: '1:1',  unit: '',       label: 'Persönliche Expertenauswertung\njedes einzelnen Falls' },
                { Icon: Flag,      stat: '1',    unit: 'Ziel',   label: 'Klare Entscheidungsgrundlage\nfür Ihr Grundstück' },
              ].map(({ Icon, stat, unit, label }) => (
                <div
                  key={stat + label}
                  className="bg-white p-8 rounded-[18px] shadow-card flex flex-col items-center text-center hover:shadow-card-hover transition-shadow duration-[250ms]"
                >
                  <div className="w-12 h-12 bg-surface-bright rounded-[12px] flex items-center justify-center mb-5">
                    <Icon size={20} strokeWidth={2} className="text-secondary" />
                  </div>
                  <div className="text-[38px] font-bold text-primary mb-1 leading-none">
                    {stat}
                    {unit && <span className="text-[20px] font-semibold text-accent ml-1">{unit}</span>}
                  </div>
                  <p className="text-[13px] text-on-surface-variant mt-2 leading-snug whitespace-pre-line">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 5 — HOW THE ANALYSIS WORKS
        ═══════════════════════════════════════ */}
        <section className="py-[120px] bg-surface-white border-b border-surface-dim" id="so-funktionierts">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <div className="grid md:grid-cols-2 gap-16 items-start">

              {/* Left — headline + 4 steps */}
              <div className="md:sticky md:top-24">
                <div className="inline-flex items-center gap-2 border border-accent/40 text-accent px-3 py-1 rounded-full text-[13px] font-semibold mb-6 bg-accent-container">
                  <PlayCircle size={13} strokeWidth={2} />
                  Jetzt direkt starten
                </div>
                <h2
                  className="font-bold text-primary mb-5 leading-[1.15] tracking-tight"
                  style={{ fontSize: 'clamp(24px, 2.8vw, 40px)' }}
                >
                  So funktioniert Ihre Baupotenzialanalyse
                </h2>
                <p className="text-[18px] text-on-surface-variant mb-10 leading-[1.6]" style={{ maxWidth: '50ch' }}>
                  Starten Sie direkt — das Formular rechts ist das echte Analyse-Formular. Geben Sie Ihr Ziel, Ihre Daten und die Adresse ein, und unser Expertenteam übernimmt den Rest.
                </p>

                <ol className="space-y-7">
                  {[
                    { n: 1, title: 'Grundstücksdaten eingeben',         desc: 'Erfassen Sie Ihr Planungsziel, Ihre Kontaktdaten und die genaue Lage des Grundstücks direkt im Formular.',                                                        Icon: PenLine  },
                    { n: 2, title: 'Planungsrahmenbedingungen angeben', desc: 'Teilen Sie Informationen zum Bestand, zum Planungsrecht (B-Plan, § 34) und zu Ihrem konkreten Vorhaben mit.',                                                       Icon: Scale    },
                    { n: 3, title: 'Expertenanalyse Ihres Grundstücks', desc: 'Unser Expertenteam prüft Ihr Grundstück planungsrechtlich und bewertet alle Entwicklungsoptionen fachlich fundiert.',                                               Icon: Search   },
                    { n: 4, title: 'PDF-Report mit Handlungsempfehlungen',desc: 'Sie erhalten einen strukturierten PDF-Report mit klaren Einschätzungen, konkreten Optionen und dem nächsten sinnvollen Schritt.',                                  Icon: FileText },
                  ].map(({ n, title, desc, Icon }) => (
                    <li key={n} className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-soft">
                          <Icon size={17} strokeWidth={2} />
                        </div>
                        {n < 4 && (
                          <div className="absolute left-1/2 top-full -translate-x-1/2 w-px h-6 bg-surface-dim mt-1" />
                        )}
                      </div>
                      <div className="pt-1">
                        <h4 className="font-semibold text-primary text-[15px] mb-1">
                          <span className="text-accent mr-1.5 text-[13px] font-bold">{String(n).padStart(2, '0')}.</span>
                          {title}
                        </h4>
                        <p className="text-on-surface-variant text-[15px] leading-[1.6]">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Trust note */}
                <div className="mt-10 flex items-center gap-3 bg-surface-bright rounded-[14px] p-4">
                  <Shield size={18} strokeWidth={2} className="text-accent flex-shrink-0" />
                  <p className="text-[13px] text-on-surface-variant leading-snug">
                    <strong className="text-primary font-semibold">DSGVO-konform.</strong>{' '}
                    Ihre Daten werden verschlüsselt übertragen und ausschließlich für die Analyse verwendet.
                  </p>
                </div>
              </div>

              {/* Right — LIVE embedded wizard */}
              <div>
                <HomeWizard />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 6 — SERVICES / PRICING
        ═══════════════════════════════════════ */}
        <section className="py-[120px] bg-surface-bright border-b border-surface-dim" id="leistungen">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <div className="text-center mb-14">
              <h2
                className="font-bold text-primary mb-6 leading-[1.15] tracking-tight"
                style={{ fontSize: 'clamp(26px, 3vw, 42px)' }}
              >
                Welche Analyse passt zu Ihrem Vorhaben?
              </h2>
              <p className="text-[18px] text-on-surface-variant mx-auto leading-[1.6]" style={{ maxWidth: '56ch' }}>
                Je nach Ziel reicht manchmal ein schneller Überblick — oder Sie benötigen eine
                tiefergehende Beurteilung. Drei Analyse-Optionen mit klar definiertem Leistungsumfang.
                Alle Preise zzgl. 19&nbsp;% MwSt.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">

              {/* QuickCheck */}
              <div className="bg-white p-8 rounded-[18px] shadow-card flex flex-col hover:shadow-card-hover transition-shadow duration-[250ms]">
                <div className="flex-1">
                  <p className="text-[12px] text-on-surface-variant font-semibold uppercase tracking-wider mb-3">
                    Für eine schnelle Ersteinschätzung
                  </p>
                  <h3 className="text-[24px] font-bold text-primary mb-1">QuickCheck</h3>
                  <div className="mb-3 mt-5">
                    <span className="text-[38px] font-bold text-primary">249 €</span>
                    <span className="text-[13px] text-on-surface-variant ml-2">+ 19&nbsp;% MwSt.</span>
                  </div>
                  <p className="text-[13px] font-medium text-secondary mb-6 flex items-center gap-1.5">
                    <Clock size={13} strokeWidth={2} />
                    Bearbeitung: 3 Werktage
                  </p>
                  <div className="h-px bg-surface-dim mb-6" />
                  <ul className="space-y-3 text-[15px] text-on-surface-variant mb-8">
                    {['Planungsrechtliche Vorprüfung', 'Prüfung nach BauGB § 34 / B-Plan', 'Verständlicher PDF-Kurzbericht', 'Klare Handlungsempfehlung'].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={14} strokeWidth={2.5} className="text-secondary flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {['Expertengespräch', 'Städtebauliche Skizzen'].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-on-surface-variant/40">
                        <span className="flex-shrink-0 mt-0.5 text-[13px]">—</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/analyse?package=QUICK_CHECK"
                  className="w-full flex items-center justify-center font-semibold text-[15px] border-2 border-primary text-primary hover:bg-surface-bright transition-colors duration-[120ms]"
                  style={{ height: '52px', borderRadius: '14px' }}
                >
                  QuickCheck wählen
                </Link>
              </div>

              {/* Potenzialanalyse — FEATURED */}
              <div className="bg-primary p-9 rounded-[18px] flex flex-col relative shadow-card-hover">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-5 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider whitespace-nowrap">
                  Unsere Empfehlung
                </div>
                <div className="flex-1">
                  <p className="text-[12px] text-white/50 font-semibold uppercase tracking-wider mb-3">
                    Umfassende Prüfung inkl. Fachgespräch
                  </p>
                  <h3 className="text-[24px] font-bold text-white mb-1">Potenzialanalyse</h3>
                  <div className="mb-3 mt-5">
                    <span className="text-[46px] font-bold text-white">690 €</span>
                    <span className="text-[13px] text-white/50 ml-2">+ 19&nbsp;% MwSt.</span>
                  </div>
                  <p className="text-[13px] font-medium text-accent mb-6 flex items-center gap-1.5">
                    <Clock size={13} strokeWidth={2} />
                    Bearbeitung: 5 Werktage
                  </p>
                  <div className="h-px bg-white/15 mb-6" />
                  <ul className="space-y-3 text-[15px] text-white/80 mb-8">
                    {['Vollständige planungsrechtliche Prüfung', 'Ermittlung des max. Bauvolumens', 'Detaillierter PDF-Report', '30 Min. telefonisches Expertengespräch', 'Handlungsempfehlung für Bauvorbescheid'].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={14} strokeWidth={2.5} className="text-accent flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/analyse?package=POTENTIAL_ANALYSIS"
                  className="w-full flex items-center justify-center font-semibold text-[15px] bg-secondary text-on-secondary hover:bg-cta-hover transition-colors duration-[120ms]"
                  style={{ height: '52px', borderRadius: '14px' }}
                >
                  Potenzialanalyse starten
                </Link>
              </div>

              {/* Machbarkeitsstudie */}
              <div className="bg-white p-8 rounded-[18px] shadow-card flex flex-col hover:shadow-card-hover transition-shadow duration-[250ms]">
                <div className="flex-1">
                  <p className="text-[12px] text-on-surface-variant font-semibold uppercase tracking-wider mb-3">
                    Für komplexe Bauvorhaben &amp; Projektentwickler
                  </p>
                  <h3 className="text-[24px] font-bold text-primary mb-1">Machbarkeitsstudie</h3>
                  <div className="mb-3 mt-5">
                    <span className="text-[38px] font-bold text-primary">ab 3.490 €</span>
                    <span className="text-[13px] text-on-surface-variant ml-2">+ 19&nbsp;% MwSt.</span>
                  </div>
                  <p className="text-[13px] font-medium text-secondary mb-6 flex items-center gap-1.5">
                    <Clock size={13} strokeWidth={2} />
                    Bearbeitung: 10–15 Werktage
                  </p>
                  <div className="h-px bg-surface-dim mb-6" />
                  <ul className="space-y-3 text-[15px] text-on-surface-variant mb-8">
                    {['Vollumfängliche planungsrechtliche Analyse', 'Städtebauliche Skizzen & Massenstudien', 'Ausführlicher Gutachterbericht', '60 Min. Beratung durch Fachexperten', 'Behördenabstimmung & Vorbescheidbegleitung'].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={14} strokeWidth={2.5} className="text-secondary flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/analyse?package=FEASIBILITY_STUDY"
                  className="w-full flex items-center justify-center font-semibold text-[15px] border-2 border-primary text-primary hover:bg-surface-bright transition-colors duration-[120ms]"
                  style={{ height: '52px', borderRadius: '14px' }}
                >
                  Machbarkeitsstudie anfragen
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 7 — FAQ (40 questions)
        ═══════════════════════════════════════ */}
        <section className="py-[120px] bg-surface-white border-b border-surface-dim" id="faq">
          <div className="max-w-[760px] mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="font-bold text-primary mb-5 leading-[1.15] tracking-tight"
                style={{ fontSize: 'clamp(26px, 3vw, 42px)' }}
              >
                Häufig gestellte Fragen
              </h2>
              <p className="text-[18px] text-on-surface-variant mb-8 leading-[1.6]">
                Antworten auf die wichtigsten Fragen rund um Baupotenzial, Planungsrecht und unsere Analyse.
              </p>
              <div className="relative">
                <input
                  type="text"
                  id="faq-search"
                  className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-surface-dim focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-colors duration-[120ms] bg-white text-[15px] text-primary font-medium"
                  placeholder="Fragen durchsuchen..."
                  value={faqSearch}
                  onChange={(e) => {
                    setFaqSearch(e.target.value);
                    setVisibleFaqCount(8);
                    setOpenFaqIndex(null);
                  }}
                />
                <Search size={16} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              </div>
            </div>

            <div className="bg-surface-bright rounded-[18px] overflow-hidden shadow-card divide-y divide-surface-dim">
              {displayedFaqs.length > 0 ? (
                displayedFaqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index}>
                      <button
                        className="w-full py-5 px-6 flex justify-between items-center text-left focus:outline-none"
                        onClick={() => toggleFaq(index)}
                      >
                        <span className="text-[15px] md:text-[16px] font-semibold text-primary hover:text-secondary transition-colors duration-[120ms] pr-4">
                          {faq.q}
                        </span>
                        <ChevronDown
                          size={18}
                          strokeWidth={2}
                          className={`flex-shrink-0 transition-transform duration-[250ms] ${isOpen ? 'rotate-180 text-secondary' : 'text-on-surface-variant'}`}
                        />
                      </button>
                      <div className={`overflow-hidden transition-all duration-[250ms] ${isOpen ? 'max-h-[400px]' : 'max-h-0'}`}>
                        <div className="pb-5 px-6 text-[15px] leading-[1.6] text-on-surface-variant">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-on-surface-variant text-[15px]">
                  Keine Treffer für Ihre Suche.
                </div>
              )}
            </div>

            {visibleFaqCount < filteredFaqs.length && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setVisibleFaqCount((prev) => prev + 8)}
                  className="border-2 border-primary text-primary px-8 font-semibold text-[15px] hover:bg-surface-bright transition-colors duration-[120ms]"
                  style={{ height: '48px', borderRadius: '12px' }}
                >
                  Weitere Fragen anzeigen ({filteredFaqs.length - visibleFaqCount} verbleibend)
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 8 — NEWSLETTER / LEAD MAGNET
        ═══════════════════════════════════════ */}
        <section className="py-[120px] bg-surface-bright border-b border-surface-dim" id="baupotenzial-report">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 border border-accent/40 text-accent px-4 py-1.5 rounded-full text-[13px] font-semibold mb-6 bg-accent-container">
                  <Rss size={13} strokeWidth={2} />
                  Kostenlos &amp; jederzeit kündbar
                </div>
                <h2
                  className="font-bold text-primary mb-5 leading-[1.15] tracking-tight"
                  style={{ fontSize: 'clamp(24px, 2.8vw, 38px)' }}
                >
                  Bleiben Sie beim Thema Baupotenzial auf dem Laufenden.
                </h2>
                <p className="text-[18px] text-on-surface-variant leading-[1.6] mb-8" style={{ maxWidth: '52ch' }}>
                  Unser Baupotenzial-Report hält Sie über aktuelle Entwicklungen im Planungsrecht
                  auf dem Laufenden — ohne generisches Newsletter-Getöse. Nur relevante Inhalte
                  für Grundstückseigentümer, Investoren und Projektentwickler.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    { Icon: Scale,       text: 'Planungsrechtliche Änderungen & Praxishinweise' },
                    { Icon: Lightbulb,   text: 'Praxisbeispiele & Analyseergebnisse' },
                    { Icon: TrendingUp,  text: 'Marktentwicklungen bei Nachverdichtung & Teilung' },
                    { Icon: Zap,         text: 'Exklusive Tipps für Eigentümer & Investoren' },
                  ].map(({ Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-[16px] font-medium text-primary">
                      <div className="w-8 h-8 bg-white rounded-[10px] flex items-center justify-center flex-shrink-0 shadow-soft">
                        <Icon size={15} strokeWidth={2} className="text-secondary" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — email form */}
              <div className="bg-white rounded-[18px] shadow-card p-10">
                {newsletterSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 bg-surface-bright rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={28} strokeWidth={2} className="text-secondary" />
                    </div>
                    <h3 className="text-[22px] font-bold text-primary mb-2">Vielen Dank!</h3>
                    <p className="text-[15px] text-on-surface-variant">
                      Sie erhalten in Kürze eine Bestätigungsmail.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-[22px] font-bold text-primary mb-2">Jetzt kostenfrei anmelden</h3>
                    <p className="text-[15px] text-on-surface-variant mb-6">
                      Kein Spam. Keine Werbung. Nur Inhalt, der wirklich zählt.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-primary mb-1.5">
                          Ihr Vorname
                        </label>
                        <input
                          type="text"
                          placeholder="Max"
                          className="w-full h-11 px-4 rounded-[10px] border border-surface-dim focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-colors duration-[120ms] bg-surface-white text-[15px] text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-primary mb-1.5">
                          Ihre E-Mail-Adresse
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="max@beispiel.de"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          className="w-full h-11 px-4 rounded-[10px] border border-surface-dim focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-colors duration-[120ms] bg-surface-white text-[15px] text-primary"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-secondary text-on-secondary font-semibold text-[16px] hover:bg-cta-hover transition-colors duration-[120ms] mt-2"
                        style={{ height: '52px', borderRadius: '14px' }}
                      >
                        Kostenfrei anmelden
                      </button>
                      <p className="text-[12px] text-on-surface-variant text-center">
                        Mit der Anmeldung stimmen Sie unserer{' '}
                        <Link href="/datenschutz" className="underline hover:text-primary transition-colors duration-[120ms]">
                          Datenschutzerklärung
                        </Link>{' '}
                        zu.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 9 — CONTACT CTA
        ═══════════════════════════════════════ */}
        <section className="py-[120px] bg-primary border-b border-primary-container" id="kontakt">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 text-center">
            <div className="max-w-[52ch] mx-auto">
              <div className="w-14 h-14 bg-white/8 rounded-[16px] flex items-center justify-center mx-auto mb-6">
                <Building2 size={26} strokeWidth={2} className="text-accent" />
              </div>
              <h2
                className="font-bold text-white mb-5 leading-[1.15] tracking-tight"
                style={{ fontSize: 'clamp(24px, 2.8vw, 38px)' }}
              >
                Klarheit über Ihr Grundstück? Starten Sie jetzt Ihre Baupotenzialanalyse — oder
                sprechen Sie direkt mit unserem Expertenteam.
              </h2>
              <p className="text-[18px] text-white/60 mb-10 leading-[1.6]">
                Unsere Experten begleiten Sie von der ersten Frage bis zur klaren Handlungsempfehlung.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/analyse"
                  className="inline-flex items-center gap-2 bg-secondary text-on-secondary font-semibold text-[16px] hover:bg-cta-hover transition-colors duration-[120ms]"
                  style={{ height: '56px', paddingLeft: '32px', paddingRight: '32px', borderRadius: '14px' }}
                >
                  <Building2 size={18} strokeWidth={2} />
                  Grundstück analysieren
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 whitespace-nowrap text-white/70 text-[16px] font-semibold hover:text-white transition-colors duration-[120ms] border border-white/25 px-8 hover:border-white/50"
                  style={{ height: '56px', borderRadius: '14px' }}
                >
                  <PhoneCall size={17} strokeWidth={2} />
                  Persönliches Rückrufgespräch vereinbaren
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

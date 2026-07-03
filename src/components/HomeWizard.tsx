'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusSquare,
  Home,
  ArrowUpFromLine,
  SplitSquareHorizontal,
  RotateCcw,
  HelpCircle,
  RefreshCw,
  CheckCircle,
  Check,
  AlertCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  Cloud,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// HomeWizard — Real 3-step embed (Goal → Contact → Address)
// Mirrors the logic from /analyse/page.tsx; on complete, forwards
// to /analyse so the user continues from step 4 onward seamlessly.
// ─────────────────────────────────────────────────────────────────

const GOALS = [
  { val: 'NEUBAU',         label: 'Neubau',                Icon: PlusSquare,      desc: 'Neues Hauptgebäude errichten.' },
  { val: 'NACHVERDICHTUNG',label: 'Nachverdichtung',        Icon: Home,            desc: 'Zusätzliche Wohneinheit/en auf bereits bebautem Land.' },
  { val: 'AUFSTOCKUNG',    label: 'Aufstockung',            Icon: ArrowUpFromLine, desc: 'Erweiterung bestehender Gebäude nach oben.' },
  { val: 'TEILUNG',        label: 'Teilung / Parzellierung',Icon: SplitSquareHorizontal, desc: 'Grundstücksteilung und Parzellierung.' },
  { val: 'ERSATZNEUBAU',   label: 'Ersatzneubau',           Icon: RotateCcw,       desc: 'Abbruch und anschließender Wiederaufbau.' },
  { val: 'SONSTIGES',      label: 'Sonstiges',              Icon: HelpCircle,      desc: 'Andere planungsrechtliche Fragestellung.' },
];

const GERMAN_STATES = [
  'Baden-Württemberg','Bayern','Berlin','Brandenburg','Bremen',
  'Hamburg','Hessen','Mecklenburg-Vorpommern','Niedersachsen',
  'Nordrhein-Westfalen','Rheinland-Pfalz','Saarland','Sachsen',
  'Sachsen-Anhalt','Schleswig-Holstein','Thüringen',
];

type Step = 1 | 2 | 3;

interface FormState {
  analysisGoal: string;
  importantQuestion: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
  agbAcceptedStep2: boolean;
  addressStreet: string;
  addressNumber: string;
  addressZip: string;
  addressCity: string;
  addressState: string;
}

const EMPTY_FORM: FormState = {
  analysisGoal: '',
  importantQuestion: '',
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: '',
  contactRole: '',
  agbAcceptedStep2: false,
  addressStreet: '',
  addressNumber: '',
  addressZip: '',
  addressCity: '',
  addressState: 'Nordrhein-Westfalen',
};

export default function HomeWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isForwarding, setIsForwarding] = useState(false);

  // ── Initialize / restore lead session ──
  useEffect(() => {
    const savedId = localStorage.getItem('mein_baupotenzial_lead_id');
    if (savedId) {
      fetch(`/api/leads/${savedId}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          setLeadId(data.id);
          setForm({
            analysisGoal:      data.analysisGoal      || '',
            importantQuestion: data.importantQuestion || '',
            contactFirstName:  data.contactFirstName  || '',
            contactLastName:   data.contactLastName   || '',
            contactEmail:      data.contactEmail      || '',
            contactPhone:      data.contactPhone      || '',
            contactRole:       data.contactRole       || '',
            agbAcceptedStep2:  data.agbAcceptedStep2  || false,
            addressStreet:     data.addressStreet     || '',
            addressNumber:     data.addressNumber     || '',
            addressZip:        data.addressZip        || '',
            addressCity:       data.addressCity       || '',
            addressState:      data.addressState      || 'Nordrhein-Westfalen',
          });
          if (data.currentStep && data.currentStep >= 2 && data.currentStep <= 3) {
            setStep(data.currentStep as Step);
          }
        })
        .catch(() => {
          localStorage.removeItem('mein_baupotenzial_lead_id');
          createLead();
        });
    } else {
      createLead();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createLead = async () => {
    try {
      const res = await fetch('/api/leads', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLeadId(data.id);
        localStorage.setItem('mein_baupotenzial_lead_id', data.id);
      }
    } catch { /* continue offline */ }
  };

  const save = async (fields = form, currentStep: number = step) => {
    if (!leadId) return;
    setIsSaving(true);
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, currentStep }),
      });
    } catch { /* silent */ } finally {
      setIsSaving(false);
    }
  };

  const set = (name: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (step === 1 && !form.analysisGoal) errs.analysisGoal = 'Bitte wählen Sie ein Ziel.';
    if (step === 2) {
      if (!form.contactFirstName) errs.contactFirstName = 'Pflichtfeld';
      if (!form.contactLastName)  errs.contactLastName  = 'Pflichtfeld';
      if (!form.contactEmail || !/\S+@\S+\.\S+/.test(form.contactEmail)) errs.contactEmail = 'Gültige E-Mail erforderlich.';
      if (!form.contactRole)      errs.contactRole      = 'Bitte wählen Sie Ihre Rolle.';
      if (!form.agbAcceptedStep2) errs.agbAcceptedStep2 = 'Bitte stimmen Sie zu.';
    }
    if (step === 3) {
      if (!form.addressStreet) errs.addressStreet = 'Pflichtfeld';
      if (!form.addressNumber) errs.addressNumber = 'Pflichtfeld';
      if (!form.addressZip)    errs.addressZip    = 'Pflichtfeld';
      if (!form.addressCity)   errs.addressCity   = 'Pflichtfeld';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = async () => {
    if (!validate()) return;
    const nextStep = (step + 1) as Step;
    await save(form, nextStep);
    if (step === 3) {
      setIsForwarding(true);
      router.push('/analyse');
    } else {
      setStep(nextStep);
    }
  };

  const back = () => {
    if (step > 1) setStep((prev) => (prev - 1) as Step);
  };

  const progress = ((step - 1) / 3) * 100;

  const inputCls = (field: keyof FormState) =>
    `w-full px-3 py-2.5 rounded-[10px] text-[15px] font-medium focus:outline-none focus:ring-2 transition-colors duration-[120ms] bg-white text-primary ${
      errors[field]
        ? 'border border-red-400 focus:ring-red-200'
        : 'border border-surface-dim focus:border-secondary focus:ring-secondary/20'
    }`;

  return (
    <div className="bg-white rounded-[18px] shadow-card border border-surface-dim overflow-hidden flex flex-col">

      {/* ── Browser chrome header ── */}
      <div className="bg-primary px-5 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
        </div>
        <div className="text-[11px] text-white/60 bg-primary-container px-4 py-1 rounded-full flex-grow text-center font-medium tracking-wide">
          mein-baupotenzial.de/analyse
        </div>
        <div className="flex items-center gap-1.5">
          {isSaving
            ? <RefreshCw size={13} strokeWidth={2} className="text-secondary animate-spin" />
            : <Cloud size={13} strokeWidth={2} className="text-white/50" />
          }
          <span className="text-[10px] font-medium text-white/50">
            {isSaving ? 'Speichert...' : 'Gespeichert'}
          </span>
        </div>
      </div>

      {/* ── Step indicator + progress bar ── */}
      <div className="px-6 pt-5 pb-4 border-b border-surface-dim bg-surface-white flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          {['Planungsziel', 'Ihre Daten', 'Grundstück'].map((label, i) => {
            const n = i + 1;
            const done   = n < step;
            const active = n === step;
            return (
              <React.Fragment key={label}>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-colors duration-[120ms] ${
                      done   ? 'bg-secondary text-white'
                      : active ? 'bg-primary text-white'
                      : 'bg-surface-bright text-on-surface-variant'
                    }`}
                  >
                    {done ? <Check size={12} strokeWidth={2.5} /> : n}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${
                    active ? 'text-primary' : done ? 'text-secondary' : 'text-on-surface-variant'
                  }`}>
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-colors duration-[250ms] ${done ? 'bg-secondary' : 'bg-surface-dim'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="w-full h-1 bg-surface-bright rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full transition-all duration-[250ms]"
            style={{ width: `${Math.max(6, progress)}%` }}
          />
        </div>
        <p className="text-[11px] text-on-surface-variant mt-1.5 font-medium">
          Schritt {step} von 3 — 10 Schritte insgesamt auf der nächsten Seite
        </p>
      </div>

      {/* ── Step content ── */}
      <div className="p-6 flex-1 overflow-y-auto" style={{ maxHeight: '520px' }}>

        {/* STEP 1 — Planning Goal */}
        {step === 1 && (
          <div>
            <h3 className="text-lg font-bold text-primary mb-1">Was möchten Sie klären?</h3>
            <p className="text-[13px] text-on-surface-variant mb-5">
              Wählen Sie das primäre Ziel Ihrer Grundstücksprüfung.
            </p>
            {errors.analysisGoal && (
              <p className="text-xs text-red-500 mb-3 flex items-center gap-1">
                <AlertCircle size={13} strokeWidth={2} />
                {errors.analysisGoal}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {GOALS.map((g) => (
                <label
                  key={g.val}
                  className={`p-4 rounded-[14px] border-2 flex items-start gap-3 cursor-pointer transition-colors duration-[120ms] ${
                    form.analysisGoal === g.val
                      ? 'border-secondary bg-secondary-container'
                      : 'border-surface-dim hover:border-secondary/50 bg-white'
                  }`}
                  onClick={() => {
                    set('analysisGoal', g.val);
                    save({ ...form, analysisGoal: g.val }, 1);
                  }}
                >
                  <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                    form.analysisGoal === g.val
                      ? 'bg-secondary text-white'
                      : 'bg-surface-bright text-on-surface-variant'
                  }`}>
                    <g.Icon size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm">{g.label}</p>
                    <p className="text-[11px] text-on-surface-variant leading-snug mt-0.5">{g.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            {form.analysisGoal && (
              <div className="border-t border-surface-dim pt-4">
                <label className="block text-xs font-bold text-primary mb-1.5">
                  Was ist Ihre wichtigste Frage?{' '}
                  <span className="font-normal text-on-surface-variant">(optional, 1–2 Sätze)</span>
                </label>
                <textarea
                  value={form.importantQuestion}
                  onChange={(e) => set('importantQuestion', e.target.value)}
                  onBlur={() => save()}
                  rows={2}
                  placeholder="z. B. Ist eine Hinterlandbebauung mit einem Flachdach-Bungalow planungsrechtlich zulässig?"
                  className={inputCls('importantQuestion') + ' resize-none'}
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — Contact Details */}
        {step === 2 && (
          <div>
            <h3 className="text-lg font-bold text-primary mb-1">Ihre Kontaktdaten</h3>
            <p className="text-[13px] text-on-surface-variant mb-5">
              Damit wir Ihr Ergebnis zustellen und bei Rückfragen erreichbar sind. Felder mit * sind Pflicht.
            </p>
            <div className="space-y-4 max-w-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Vorname *</label>
                  <input type="text" value={form.contactFirstName}
                    onChange={(e) => set('contactFirstName', e.target.value)} onBlur={() => save()}
                    placeholder="Max" className={inputCls('contactFirstName')} />
                  {errors.contactFirstName && <p className="text-[10px] text-red-500 mt-1">{errors.contactFirstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Nachname *</label>
                  <input type="text" value={form.contactLastName}
                    onChange={(e) => set('contactLastName', e.target.value)} onBlur={() => save()}
                    placeholder="Mustermann" className={inputCls('contactLastName')} />
                  {errors.contactLastName && <p className="text-[10px] text-red-500 mt-1">{errors.contactLastName}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1">E-Mail *</label>
                <input type="email" value={form.contactEmail}
                  onChange={(e) => set('contactEmail', e.target.value)} onBlur={() => save()}
                  placeholder="max@beispiel.de" className={inputCls('contactEmail')} />
                {errors.contactEmail && <p className="text-[10px] text-red-500 mt-1">{errors.contactEmail}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1">Telefon (optional)</label>
                <input type="tel" value={form.contactPhone}
                  onChange={(e) => set('contactPhone', e.target.value)} onBlur={() => save()}
                  placeholder="+49 170 1234567" className={inputCls('contactPhone')} />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1">Ihre Rolle *</label>
                <select value={form.contactRole}
                  onChange={(e) => { set('contactRole', e.target.value); save({ ...form, contactRole: e.target.value }); }}
                  className={inputCls('contactRole')}>
                  <option value="">-- Rolle wählen --</option>
                  <option value="OWNER">Eigentümer</option>
                  <option value="CHILD_HEIR">Kind / Erbe</option>
                  <option value="AUTHORIZED">Bevollmächtigt</option>
                  <option value="OTHER">Sonstiges</option>
                </select>
                {errors.contactRole && <p className="text-[10px] text-red-500 mt-1">{errors.contactRole}</p>}
              </div>
              <div className="pt-3 border-t border-surface-dim">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox" checked={form.agbAcceptedStep2}
                    onChange={(e) => { set('agbAcceptedStep2', e.target.checked); save({ ...form, agbAcceptedStep2: e.target.checked }); }}
                    className="rounded border-surface-dim text-secondary mt-0.5"
                  />
                  <span className="text-[11px] text-on-surface-variant leading-relaxed">
                    Ich stimme den{' '}
                    <Link href="/agb" target="_blank" className="text-primary font-semibold hover:underline">AGB</Link>
                    {' '}und der{' '}
                    <Link href="/datenschutz" target="_blank" className="text-primary font-semibold hover:underline">Datenschutzerklärung</Link>
                    {' '}der van Valkenburg GmbH zu. *
                  </span>
                </label>
                {errors.agbAcceptedStep2 && <p className="text-[10px] text-red-500 mt-1">{errors.agbAcceptedStep2}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Property Address */}
        {step === 3 && (
          <div>
            <h3 className="text-lg font-bold text-primary mb-1">Wo liegt das Grundstück?</h3>
            <p className="text-[13px] text-on-surface-variant mb-5">
              Bitte tragen Sie den genauen Standort ein. Felder mit * sind Pflicht.
            </p>
            <div className="space-y-4 max-w-sm">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-primary mb-1">Straße *</label>
                  <input type="text" value={form.addressStreet}
                    onChange={(e) => set('addressStreet', e.target.value)} onBlur={() => save()}
                    placeholder="Musterstraße" className={inputCls('addressStreet')} />
                  {errors.addressStreet && <p className="text-[10px] text-red-500 mt-1">{errors.addressStreet}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Nr. *</label>
                  <input type="text" value={form.addressNumber}
                    onChange={(e) => set('addressNumber', e.target.value)} onBlur={() => save()}
                    placeholder="14b" className={inputCls('addressNumber')} />
                  {errors.addressNumber && <p className="text-[10px] text-red-500 mt-1">{errors.addressNumber}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">PLZ *</label>
                  <input type="text" value={form.addressZip}
                    onChange={(e) => set('addressZip', e.target.value)} onBlur={() => save()}
                    placeholder="40212" className={inputCls('addressZip')} />
                  {errors.addressZip && <p className="text-[10px] text-red-500 mt-1">{errors.addressZip}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-primary mb-1">Ort *</label>
                  <input type="text" value={form.addressCity}
                    onChange={(e) => set('addressCity', e.target.value)} onBlur={() => save()}
                    placeholder="Düsseldorf" className={inputCls('addressCity')} />
                  {errors.addressCity && <p className="text-[10px] text-red-500 mt-1">{errors.addressCity}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1">Bundesland</label>
                <select value={form.addressState}
                  onChange={(e) => { set('addressState', e.target.value); save({ ...form, addressState: e.target.value }); }}
                  className={inputCls('addressState')}>
                  {GERMAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="bg-surface-bright rounded-[12px] p-3 text-[12px] text-on-surface-variant flex items-start gap-2">
                <Info size={14} strokeWidth={2} className="flex-shrink-0 mt-0.5 text-accent" />
                <span>
                  Danach geht es weiter: Grundstücksdaten, Bestand, Planungsrecht, Vorhaben und Upload — alles im vollständigen Analyse-Formular.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation buttons ── */}
      <div className="px-6 py-4 border-t border-surface-dim bg-surface-white flex-shrink-0 flex items-center justify-between gap-4">
        <button
          onClick={back}
          disabled={step === 1}
          className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium hover:text-primary transition-colors duration-[120ms] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Zurück
        </button>

        <button
          onClick={next}
          disabled={isForwarding}
          className="flex items-center gap-2 bg-secondary text-on-secondary text-[15px] font-semibold px-6 disabled:opacity-60 hover:bg-cta-hover transition-colors duration-[120ms]"
          style={{ height: '44px', borderRadius: '12px' }}
        >
          {isForwarding ? (
            <>
              <RefreshCw size={15} strokeWidth={2} className="animate-spin" />
              Weiterleitung...
            </>
          ) : step === 3 ? (
            <>
              Analyse starten
              <ArrowRight size={15} strokeWidth={2} />
            </>
          ) : (
            <>
              Weiter
              <ArrowRight size={15} strokeWidth={2} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

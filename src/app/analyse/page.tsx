'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Header from '@/components/Header';

const STAGES = [
  'Ziel der Prüfung',
  'Grundstücksdaten',
  'Kontaktdaten',
  'Pläne hochladen',
  'Prüfen & Bezahlen'
];

interface UploadedDocument {
  id: string;
  category: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#f7f9fc]">
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <span translate="no" className="material-symbols-outlined text-4xl animate-spin text-accent-teal mb-4">sync</span>
            <p className="text-sm font-semibold text-primary-navy">Ladeprozess wird gestartet...</p>
          </div>
        </div>
      </div>
    }>
      <AnalyseWizardPage />
    </Suspense>
  );
}

function AnalyseWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  // Wizard Core State
  const [leadId, setLeadId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form Fields matching German spec exactly
  const [formData, setFormData] = useState({
    // Step 1: Ziel der Prüfung
    analysisGoal: '', // NEUBAU, NACHVERDICHTUNG, AUFSTOCKUNG, TEILUNG, ERSATZNEUBAU, SONSTIGES
    importantQuestion: '', // Freitext, 1-2 Sätze
    
    // Step 2: Kontaktdaten
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    contactRole: '', // OWNER, CHILD_HEIR, AUTHORIZED, OTHER (Eigentümer / Kind/Erbe / Bevollmächtigt / Sonstiges)
    agbAcceptedStep2: false, // Pflicht in Schritt 2
    
    // Step 3: Grundstück finden
    addressStreet: '',
    addressNumber: '',
    addressZip: '',
    addressCity: '',
    addressState: 'Nordrhein-Westfalen',
    cadastralDistrict: '', // Flurstück / Gemarkung
    geoportalLink: '',
    
    // Step 4: Grundstücksdaten
    plotArea: '',
    plotShape: '', // NORMAL, NARROW, DEEP, CORNER (normal / schmal / sehr tief / Eckgrundstück)
    slope: '', // YES, NO, DONT_KNOW (Hanglage)
    developmentStatus: '', // DEVELOPED, PARTIAL, UNRESOLVED (erschlossen / teilweise / unklar)
    accessRoad: '', // DIRECT, EASEMENT, UNRESOLVED (direkt / über Wegerecht / unklar)
    
    // Step 5: Bestand
    plotIsBuilt: false, // Unbebaut (false) / Bebaut (true)
    buildingType: '', // EFH, MFH, COMMERCIAL, MIXED, OTHER
    constructionYear: '',
    floorsCount: '',
    buildingUsage: '', // SELF_USED, RENTED, VACANT (selbst genutzt / vermietet / leerstehend)
    demolitionPossible: '', // YES, NO, DONT_KNOW
    
    // Step 6: Planungsrecht
    zoningPlanExists: 'DONT_KNOW', // YES, NO, DONT_KNOW
    hasPlanningDocuments: false, // ja/nein
    neighborhoodZoning: '', // EFH, MIXED, MFH, COMMERCIAL, DONT_KNOW (überwiegend EFH / gemischt / überwiegend MFH / Gewerbe / unklar)
    planningSpecialNotes: '', // Comma separated selected values: Denkmalschutz, Milieuschutz, Erhaltungssatzung
    planningInfoDetails: '',
    
    // Step 7: Vorhaben konkretisieren (path specific)
    targetType: '', // EFH, DH_REH, MFH, MIXED
    targetArea: '', // ca. Wohnfläche
    targetUnits: '', // Anzahl Einheiten
    targetDensityType: '', // Anbau, Neubau im Garten, zusätzliche Einheit, sonstiges
    targetDensityUnits: '', // 1 Einheit, 2â€“4 Einheiten, >4
    targetFloors: '', // 1 Geschoss, 2 Geschosse, unklar
    knowsStructure: false, // ja/nein
    targetDivisions: '', // 2, 3, >3
    isSalePlanned: false, // ja/nein
    projectDetails: '', // Freitext
    
    // Step 8: Rahmenbedingungen
    timelineUrgency: '', // ASAP, 3_6_MONTHS, MORE_6_MONTHS, DONT_KNOW
    projectGoal: '', // OWN_USE, SALE, RENTAL, FAMILY, INVESTOR
    budgetRange: '', // LESS_300K, 300K_600K, 600K_1_2M, MORE_1_2M, DONT_KNOW
    
    // Step 10 & Checkout
    packageSelected: 'QUICK_CHECK', // default package
    referralCodeUsed: ''
  });

  // Document states
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // hidden upload triggering refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingCategoryRef = useRef<string>('SITE_PLAN');
  
  const triggerCategoryUpload = (category: string) => {
    pendingCategoryRef.current = category;
    fileInputRef.current?.click();
  };
  
  // Checkout States
  const [showCheckout, setShowCheckout] = useState(false);
  const [referralIsValid, setReferralIsValid] = useState<boolean | null>(null);
  const [referralMessage, setReferralMessage] = useState('');
  const [checkingReferral, setCheckingReferral] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'PAYPAL' | 'BANK_TRANSFER'>('PAYPAL');
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Track field changes for autosave
  const lastSavedData = useRef<string>('');

  // 1. Initial State Restoration
  useEffect(() => {
    const pkgParam = searchParams.get('package');
    let initialPackage = 'QUICK_CHECK';
    if (pkgParam === 'POTENTIAL_ANALYSIS' || pkgParam === 'FEASIBILITY_STUDY' || pkgParam === 'QUICK_CHECK') {
      initialPackage = pkgParam;
    }

    const savedLeadId = localStorage.getItem('mein_baupotenzial_lead_id');
    
    if (savedLeadId) {
      fetch(`/api/leads/${savedLeadId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Lead session invalid');
          return res.json();
        })
        .then((data) => {
          setLeadId(data.id);
          setCurrentStep(data.currentStep || 1);
          setUploadedDocs(data.documents || []);
          
          const restoredFields = {
            analysisGoal: data.analysisGoal || '',
            importantQuestion: data.importantQuestion || '',
            
            contactFirstName: data.contactFirstName || '',
            contactLastName: data.contactLastName || '',
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            contactRole: data.contactRole || '',
            agbAcceptedStep2: data.agbAcceptedStep2 || false,
            
            addressStreet: data.addressStreet || '',
            addressNumber: data.addressNumber || '',
            addressZip: data.addressZip || '',
            addressCity: data.addressCity || '',
            addressState: data.addressState || 'Nordrhein-Westfalen',
            cadastralDistrict: data.cadastralDistrict || '',
            geoportalLink: data.geoportalLink || '',
            
            plotArea: data.plotArea ? String(data.plotArea) : '',
            plotShape: data.plotShape || '',
            slope: data.slope || '',
            developmentStatus: data.developmentStatus || '',
            accessRoad: data.accessRoad || '',
            
            plotIsBuilt: data.plotIsBuilt || false,
            buildingType: data.buildingType || '',
            constructionYear: data.constructionYear || '',
            floorsCount: data.floorsCount || '',
            buildingUsage: data.buildingUsage || '',
            demolitionPossible: data.demolitionPossible || '',
            
            zoningPlanExists: data.zoningPlanExists || 'DONT_KNOW',
            hasPlanningDocuments: data.hasPlanningDocuments || false,
            neighborhoodZoning: data.neighborhoodZoning || '',
            planningSpecialNotes: data.planningSpecialNotes || '',
            planningInfoDetails: data.planningInfoDetails || '',
            
            targetType: data.targetType || '',
            targetArea: data.targetArea || '',
            targetUnits: data.targetUnits || '',
            targetDensityType: data.targetDensityType || '',
            targetDensityUnits: data.targetDensityUnits || '',
            targetFloors: data.targetFloors || '',
            knowsStructure: data.knowsStructure || false,
            targetDivisions: data.targetDivisions || '',
            isSalePlanned: data.isSalePlanned || false,
            projectDetails: data.projectDetails || '',
            
            timelineUrgency: data.timelineUrgency || '',
            projectGoal: data.projectGoal || '',
            budgetRange: data.budgetRange || '',
            
            packageSelected: data.packageSelected || initialPackage,
            referralCodeUsed: data.referralCodeUsed || ''
          };
          
          setFormData(restoredFields);
          lastSavedData.current = JSON.stringify(restoredFields);
          setIsLoaded(true);
        })
        .catch(() => {
          localStorage.removeItem('mein_baupotenzial_lead_id');
          initializeNewLead(initialPackage);
        });
    } else {
      initializeNewLead(initialPackage);
    }
  }, [searchParams]);

  // Create new lead draft in database
  const initializeNewLead = async (initialPackage: string) => {
    try {
      const res = await fetch('/api/leads', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLeadId(data.id);
        setCurrentStep(1);
        localStorage.setItem('mein_baupotenzial_lead_id', data.id);
        
        const freshFields = { ...formData, packageSelected: initialPackage };
        setFormData(freshFields);
        lastSavedData.current = JSON.stringify(freshFields);
      }
    } catch (e) {
      console.error('Failed to initialize lead session:', e);
    }
    setIsLoaded(true);
  };

  // Autosave
  const saveLeadData = async (fieldsToSave = formData, step = currentStep) => {
    if (!leadId) return;

    const dataString = JSON.stringify(fieldsToSave);
    if (dataString === lastSavedData.current && step === currentStep) return;

    setIsSaving(true);
    try {
      const parsedPlotArea = fieldsToSave.plotArea ? parseFloat(fieldsToSave.plotArea) : null;
      
      const payload = {
        ...fieldsToSave,
        plotArea: isNaN(Number(parsedPlotArea)) ? null : parsedPlotArea,
        currentStep: step
      };

      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        lastSavedData.current = dataString;
      } else if (res.status === 404) {
        console.warn('Lead session invalid (404), resetting...');
        localStorage.removeItem('mein_baupotenzial_lead_id');
        initializeNewLead(formData.packageSelected);
      }
    } catch (e) {
      console.error('Autosave failed:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = () => {
    saveLeadData();
  };

  const handleStepChange = (nextStep: number) => {
    if (nextStep < 1 || nextStep > 5) return;
    setCurrentStep(nextStep);
    saveLeadData(formData, nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  // Multiple selection for Planungsrecht Besonderheiten
  const handleCheckboxListChange = (value: string, isChecked: boolean) => {
    const currentNotes = formData.planningSpecialNotes ? formData.planningSpecialNotes.split(',').filter(Boolean) : [];
    let updatedNotes: string[];

    if (isChecked) {
      updatedNotes = [...currentNotes, value];
    } else {
      updatedNotes = currentNotes.filter(n => n !== value);
    }

    const updatedNotesStr = updatedNotes.join(',');
    const updated = {
      ...formData,
      planningSpecialNotes: updatedNotesStr
    };
    setFormData(updated);
    saveLeadData(updated);
  };

  // Upload File
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !leadId) return;

    setIsUploading(true);
    setUploadError('');

    const category = pendingCategoryRef.current;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', category);
    fd.append('leadId', leadId);

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: fd
      });

      if (res.ok) {
        const doc = await res.json();
        setUploadedDocs(prev => [...prev, doc]);
      } else {
        const errorData = await res.json();
        setUploadError(errorData.error || 'Fehler beim Hochladen der Datei.');
      }
    } catch (err) {
      setUploadError('Verbindung zum Server fehlgeschlagen.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Delete Document
  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/uploads?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUploadedDocs(prev => prev.filter(d => d.id !== id));
      } else {
        console.error('Failed to delete document from DB');
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  // Verify referral code
  const handleCheckReferral = async () => {
    if (!formData.referralCodeUsed.trim()) return;

    setCheckingReferral(true);
    setReferralIsValid(null);
    setReferralMessage('');

    try {
      const res = await fetch(`/api/referral?code=${encodeURIComponent(formData.referralCodeUsed.trim())}`);
      const data = await res.json();
      
      if (data.isValid) {
        setReferralIsValid(true);
        setReferralMessage('Gutscheincode erfolgreich angewendet! Ihr Quick Check ist kostenlos.');
        saveLeadData({ ...formData, referralCodeUsed: data.code });
      } else {
        setReferralIsValid(false);
        setReferralMessage(data.message || 'Ungültiger Code.');
      }
    } catch (err) {
      setReferralMessage('Fehler bei der Überprüfung des Gutscheincodes.');
    } finally {
      setCheckingReferral(false);
    }
  };

  const handleFinishWizard = () => {
    localStorage.removeItem('mein_baupotenzial_lead_id');
    router.push('/');
  };

  const handleBankTransferSubmit = async () => {
    if (!leadId) return;

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          paymentMethod: 'BANK_TRANSFER',
          paymentStatus: 'PENDING',
          currentStep: 5
        })
      });

      if (res.ok) {
        setCheckoutCompleted(true);
      } else {
        if (res.status === 404) {
          localStorage.removeItem('mein_baupotenzial_lead_id');
          initializeNewLead(formData.packageSelected);
        }
        setCheckoutError('Fehler beim Abschließen Ihrer Bestellung.');
      }
    } catch (err) {
      setCheckoutError('Fehler bei der Verbindung zum Server.');
    }
  };

  const handleFreeSubmit = async () => {
    if (!leadId || formData.packageSelected !== 'QUICK_CHECK') return;

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'PAID',
          paymentMethod: 'REFERRAL',
          paymentStatus: 'SUCCESS',
          pricePaid: 0,
          currentStep: 5
        })
      });

      if (res.ok) {
        setCheckoutCompleted(true);
      } else {
        if (res.status === 404) {
          localStorage.removeItem('mein_baupotenzial_lead_id');
          initializeNewLead(formData.packageSelected);
        }
        setCheckoutError('Fehler beim Abschließen Ihrer Bestellung.');
      }
    } catch (err) {
      setCheckoutError('Fehler bei der Verbindung zum Server.');
    }
  };

  // Pricing math
  const isQuickCheck = formData.packageSelected === 'QUICK_CHECK';
  const rawPrice = isQuickCheck ? 249 
    : formData.packageSelected === 'POTENTIAL_ANALYSIS' ? 690 
    : 3490;
  
  const isFree = isQuickCheck && referralIsValid === true;
  const price = isFree ? 0 : rawPrice;
  const vat = price * 0.19;
  const totalPrice = price + vat;

  // Validation before step forwarding
  const isStepValid = (step: number) => {
    switch (step) {
      case 1: 
        return !!formData.analysisGoal;
      case 2: 
        return (
          !!formData.addressStreet && 
          !!formData.addressNumber && 
          formData.addressNumber.trim().length > 0 &&
          /^\d{5}$/.test(formData.addressZip) && 
          !!formData.addressCity
        );
      case 3: 
        return (
          !!formData.contactFirstName && 
          !!formData.contactLastName && 
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.contactEmail) && 
          !!formData.contactPhone && 
          formData.contactPhone.replace(/[^0-9]/g, '').length >= 6 &&
          !!formData.contactRole && 
          formData.agbAcceptedStep2
        );
      default: 
        return true;
    }
  };

  const canNavigateToStep = (targetStep: number) => {
    for (let i = 1; i < targetStep; i++) {
      if (!isStepValid(i)) return false;
    }
    return true;
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'NEUBAU': return 'Neubau';
      case 'NACHVERDICHTUNG': return 'Nachverdichtung';
      case 'AUFSTOCKUNG': return 'Aufstockung';
      case 'TEILUNG': return 'Teilung / mehrere Einheiten';
      case 'ERSATZNEUBAU': return 'Ersatzneubau';
      default: return 'Sonstiges';
    }
  };

  const getWishesText = () => {
    const parts = [getGoalLabel(formData.analysisGoal)];
    if (formData.targetType) parts.push(`Gebäudetyp: ${formData.targetType === 'EFH' ? 'Einfamilienhaus' : formData.targetType === 'MFH' ? 'Mehrfamilienhaus' : formData.targetType === 'DH_REH' ? 'Doppel-/Reihenhaus' : 'Gemischt'}`);
    if (formData.targetArea) parts.push(`Wohnfläche: ca. ${formData.targetArea}`);
    if (formData.targetUnits) parts.push(`Wohneinheiten: ${formData.targetUnits}`);
    if (formData.targetDensityType) parts.push(`Nachverdichtung: ${formData.targetDensityType === 'EXTENSION' ? 'Anbau' : formData.targetDensityType === 'GARDEN_BUILDING' ? 'Hinterlandbebauung' : 'Zusätzliche Wohneinheit'}`);
    if (formData.projectDetails) parts.push(`Details: ${formData.projectDetails}`);
    return parts.join(' • ');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7f9fc]">
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <span translate="no" className="material-symbols-outlined text-4xl animate-spin text-accent-teal mb-4">sync</span>
            <p className="text-sm font-semibold text-primary-navy">Lade Daten...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body-md text-on-surface">
      {/* Shared Header with mobile menu */}
      <Header />
      
      {/* Header Progress Area */}
      <header className="pt-4 pb-4 md:pb-6 bg-surface-white border-b border-surface-dim w-full">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-4">
            <div>
              <h1 className="font-headline-lg text-xl md:text-headline-lg text-primary mb-1">Objekt-Analyse</h1>
              <p className="text-on-surface-variant text-xs sm:text-sm font-medium">
                {checkoutCompleted 
                  ? 'Bestellung abgeschlossen' 
                  : showCheckout 
                    ? 'Schritt 5 von 5: Paketwahl & Zahlung' 
                    : `Schritt ${currentStep} von 5: ${STAGES[currentStep - 1]}`}
              </p>
            </div>
            <div className="flex items-center sm:flex-col sm:items-end gap-1">
              <div className="flex items-center gap-1.5 text-accent-teal font-medium">
                <span translate="no" className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                  {isSaving ? 'sync' : 'check_circle'}
                </span>
                <span className="text-[11px] sm:text-xs">{isSaving ? 'Speichert...' : '✓ Gespeichert'}</span>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div 
              className="bg-accent-teal h-full transition-all duration-500"
              style={{ width: `${checkoutCompleted ? 100 : showCheckout ? 95 : (currentStep / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>
 
      {/* Mobile Step Selector (visible only on mobile) */}
      <div className="md:hidden bg-surface-container-low border-b border-surface-dim px-4 py-3">
        <select
          className="w-full bg-surface-white border border-surface-dim rounded-lg px-3 py-2.5 text-sm font-semibold text-primary focus:border-secondary focus:ring-1 focus:ring-secondary"
          value={showCheckout ? 5 : currentStep}
          onChange={(e) => {
            const step = Number(e.target.value);
            if (canNavigateToStep(step)) {
              setShowCheckout(false);
              handleStepChange(step);
            }
          }}
        >
          {STAGES.map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = checkoutCompleted || stepNum < currentStep;
            const prefix = isCompleted ? '✓' : `${String(stepNum).padStart(2, '0')}`;
            return (
              <option key={idx} value={stepNum} disabled={!canNavigateToStep(stepNum)}>
                {prefix} â€“ {label}
              </option>
            );
          })}
        </select>
      </div>

      <main className="max-w-container-max mx-auto flex flex-col md:flex-row min-h-[calc(100vh-180px)] w-full">
        {/* Side Navigation Bar */}
        <aside className="hidden md:flex w-64 bg-surface-container-low border-r border-surface-dim p-4 flex-col gap-2 shrink-0">
          <div className="mb-4 px-3">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-1">Analyse-Fortschritt</h3>
            <p className="text-caption text-on-surface-variant">Schritt für Schritt zum Baupotenzial</p>
          </div>
          <nav className="flex flex-col gap-1">
            {STAGES.map((label, idx) => {
              const stepNum = idx + 1;
              const isCompleted = checkoutCompleted || stepNum < currentStep;
              const isActive = !checkoutCompleted && !showCheckout && stepNum === currentStep;
              const isClickable = !checkoutCompleted && canNavigateToStep(stepNum);
              
              let itemClass = "flex items-center gap-3 p-3 rounded-lg transition-colors select-none ";
              let circleClass = "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-label-md font-bold ";
              let iconContent: React.ReactNode = null;
              
              if (isCompleted) {
                itemClass += "text-on-surface-variant hover:bg-surface-container-high " + (isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-80");
                circleClass += "bg-accent-teal text-white";
                iconContent = <span translate="no" className="material-symbols-outlined text-sm">check</span>;
              } else if (isActive) {
                itemClass += "text-on-secondary-container bg-secondary-container font-bold";
                circleClass += "bg-primary-navy text-white";
                iconContent = <span>{String(stepNum).padStart(2, '0')}</span>;
              } else {
                itemClass += "text-ui-steel " + (isClickable ? "cursor-pointer hover:bg-surface-container-high" : "cursor-not-allowed opacity-50");
                circleClass += "border-2 border-ui-steel";
                iconContent = <span>{String(stepNum).padStart(2, '0')}</span>;
              }
              
              const handleSidebarClick = () => {
                if (isClickable) {
                  setShowCheckout(false);
                  handleStepChange(stepNum);
                }
              };

              return (
                <div 
                  key={idx} 
                  className={itemClass}
                  onClick={handleSidebarClick}
                >
                  <div className={circleClass}>
                    {iconContent}
                  </div>
                  <span className="text-label-md font-label-md">{label}</span>
                </div>
              );
            })}
          </nav>
          <div className="mt-auto pt-8">
            <a 
              href="/kontakt"
              target="_blank"
              className="w-full flex items-center justify-center gap-2 border border-outline text-on-surface p-3 rounded-lg hover:bg-surface-container-high transition-all text-xs font-semibold"
            >
              <span translate="no" className="material-symbols-outlined">help_outline</span>
              <span className="text-label-md">Hilfe anfordern</span>
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 p-4 md:p-margin-desktop bg-surface-bright">
          <div className="max-w-3xl mx-auto space-y-12">
          {checkoutCompleted ? (
            <div className="text-center py-12">
              <span translate="no" className="material-symbols-outlined text-5xl text-accent-teal mb-6 font-bold">check_circle</span>
              <h2 className="text-2xl font-bold text-primary mb-4 font-sans">Vielen Dank für Ihre Bestellung!</h2>
              
              <div className="max-w-md mx-auto bg-surface-white border border-surface-dim p-6 rounded-xl text-left text-sm leading-relaxed mb-8 shadow-sm">
                <p className="mb-4 font-medium text-on-surface-variant">Wir haben Ihre Angaben erfolgreich erfasst. Ihr Projekt-Code lautet:</p>
                <code className="block bg-surface-container p-3 rounded text-center font-bold text-primary-navy font-mono mb-6 border border-surface-dim">{leadId}</code>
                
                {paymentMethod === 'BANK_TRANSFER' ? (
                  <>
                    <h3 className="font-bold text-primary mb-2 text-sm border-b border-surface-dim pb-1 font-sans">Zahlungsdetails (Banküberweisung)</h3>
                    <p className="mb-4 text-xs text-on-surface-variant leading-snug">Bitte überweisen Sie den ausstehenden Bruttobetrag auf folgendes Konto:</p>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr className="border-b border-surface-dim"><td className="py-2 font-semibold">Empfänger:</td><td className="py-2 text-right">van Valkenburg GmbH</td></tr>
                        <tr className="border-b border-surface-dim"><td className="py-2 font-semibold">Kreditinstitut:</td><td className="py-2 text-right">GLS Gemeinschaftsbank eG</td></tr>
                        <tr className="border-b border-surface-dim"><td className="py-2 font-semibold">IBAN:</td><td className="py-2 text-right">DE62 4306 0967 1324 3634 00</td></tr>
                        <tr className="border-b border-surface-dim"><td className="py-2 font-semibold">BIC:</td><td className="py-2 text-right font-medium">GENODEM1GLS</td></tr>
                        <tr className="border-b border-surface-dim"><td className="py-2 font-semibold">Verwendungszweck:</td><td className="py-2 text-right font-mono font-bold text-primary-navy">Analyse {leadId?.substring(0, 8)}</td></tr>
                        <tr><td className="py-2 font-bold">Betrag (Brutto):</td><td className="py-2 text-right font-black text-accent-teal">{totalPrice.toFixed(2)} €</td></tr>
                      </tbody>
                    </table>
                    <p className="mt-4 text-[10px] text-on-surface-variant leading-snug">
                      * Die planungsrechtliche Analyse beginnt unmittelbar nach Verifizierung Ihres Zahlungseingangs.
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-on-surface-variant">Wir haben Ihre PayPal-Zahlung erhalten. Sie erhalten in Kürze eine E-Mail mit der Auftragsbestätigung und den nächsten Schritten.</p>
                )}
              </div>

              <button 
                onClick={handleFinishWizard}
                className="bg-primary-navy text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow"
              >
                Zurück zur Startseite
              </button>
            </div>
            ) : showCheckout ? (
              /* WIZARD CHECKOUT (AFTER STEP 10 SUMMARY CONFIRMATION) */
              <div className="space-y-8" id="step-packages">
                <div className="text-center">
                  <h2 className="text-headline-md font-headline-md text-primary-navy">Wählen Sie Ihr Analyse-Paket</h2>
                  <p className="text-body-md text-on-surface-variant mt-2 text-xs">Detaillierte Einblicke für fundierte Entscheidungen.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Quick Check */}
                  <div 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, packageSelected: 'QUICK_CHECK' }));
                      saveLeadData({ ...formData, packageSelected: 'QUICK_CHECK' });
                    }}
                    className={`bg-surface-white border-2 rounded-xl flex flex-col overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                      formData.packageSelected === 'QUICK_CHECK' ? 'border-primary-navy shadow-md' : 'border-surface-dim'
                    }`}
                  >
                    <div className="p-6 border-b border-surface-dim bg-surface-bright">
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Quick Check</h4>
                      <p className="text-headline-md font-bold text-primary">249 € <span className="text-caption font-normal text-on-surface-variant">netto</span></p>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                      <ul className="text-label-md space-y-3">
                        <li className="flex gap-2">
                          <span translate="no" className="material-symbols-outlined text-accent-teal text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
                          <span>Erste Einschätzung</span>
                        </li>
                        <li className="flex gap-2">
                          <span translate="no" className="material-symbols-outlined text-accent-teal text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
                          <span>Baurecht-Grobcheck</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-6 mt-auto">
                      <button className={`w-full py-3 font-bold rounded-lg transition-all text-xs ${
                        formData.packageSelected === 'QUICK_CHECK' ? 'bg-primary-navy text-white' : 'border border-primary-navy text-primary-navy hover:bg-surface-container-low'
                      }`}>
                        {formData.packageSelected === 'QUICK_CHECK' ? 'Ausgewählt' : 'Auswählen'}
                      </button>
                    </div>
                  </div>

                  {/* Recommended: Potenzialanalyse */}
                  <div 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, packageSelected: 'POTENTIAL_ANALYSIS' }));
                      setReferralIsValid(null);
                      setReferralMessage('');
                      saveLeadData({ ...formData, packageSelected: 'POTENTIAL_ANALYSIS' });
                    }}
                    className={`bg-surface-white border-2 rounded-xl flex flex-col overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:scale-[1.02] z-10 ${
                      formData.packageSelected === 'POTENTIAL_ANALYSIS' ? 'border-primary-navy shadow-md' : 'border-surface-dim'
                    }`}
                  >
                    <div className="bg-primary-navy/5 text-center py-1 text-[10px] font-bold tracking-widest uppercase text-primary-navy">Empfohlen</div>
                    <div className="p-6 border-b border-surface-dim bg-surface-bright">
                      <h4 className="font-headline-sm text-headline-sm text-primary-navy mb-2">Potenzialanalyse</h4>
                      <p className="text-headline-md font-bold text-primary">690 € <span className="text-caption font-normal text-on-surface-variant">netto</span></p>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                      <ul className="text-label-md space-y-3">
                        <li className="flex gap-2">
                          <span translate="no" className="material-symbols-outlined text-accent-teal text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
                          <span>Detaillierter Report</span>
                        </li>
                        <li className="flex gap-2">
                          <span translate="no" className="material-symbols-outlined text-accent-teal text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
                          <span>Flächenberechnung</span>
                        </li>
                        <li className="flex gap-2">
                          <span translate="no" className="material-symbols-outlined text-accent-teal text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
                          <span>Marktwert-Indikation</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-6 mt-auto">
                      <button className={`w-full py-3 font-bold rounded-lg transition-all text-xs ${
                        formData.packageSelected === 'POTENTIAL_ANALYSIS' ? 'bg-primary-navy text-white' : 'border border-primary-navy text-primary-navy hover:bg-surface-container-low'
                      }`}>
                        {formData.packageSelected === 'POTENTIAL_ANALYSIS' ? 'Ausgewählt' : 'Auswählen'}
                      </button>
                    </div>
                  </div>

                  {/* Machbarkeitsstudie */}
                  <div 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, packageSelected: 'FEASIBILITY_STUDY' }));
                      setReferralIsValid(null);
                      setReferralMessage('');
                      saveLeadData({ ...formData, packageSelected: 'FEASIBILITY_STUDY' });
                    }}
                    className={`bg-surface-white border-2 rounded-xl flex flex-col overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                      formData.packageSelected === 'FEASIBILITY_STUDY' ? 'border-primary-navy shadow-md' : 'border-surface-dim'
                    }`}
                  >
                    <div className="p-6 border-b border-surface-dim bg-surface-bright">
                      <h4 className="font-headline-sm text-headline-sm text-primary mb-2">Machbarkeit</h4>
                      <p className="text-headline-md font-bold text-primary">3.490 € <span className="text-caption font-normal text-on-surface-variant">netto</span></p>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                      <ul className="text-label-md space-y-3">
                        <li className="flex gap-2">
                          <span translate="no" className="material-symbols-outlined text-accent-teal text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
                          <span>Architekten-Entwurf</span>
                        </li>
                        <li className="flex gap-2">
                          <span translate="no" className="material-symbols-outlined text-accent-teal text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
                          <span>Behörden-Abstimmung</span>
                        </li>
                        <li className="flex gap-2">
                          <span translate="no" className="material-symbols-outlined text-accent-teal text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
                          <span>Investitionsplanung</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-6 mt-auto">
                      <button className={`w-full py-3 font-bold rounded-lg transition-all text-xs ${
                        formData.packageSelected === 'FEASIBILITY_STUDY' ? 'bg-primary-navy text-white' : 'border border-primary-navy text-primary-navy hover:bg-surface-container-low'
                      }`}>
                        {formData.packageSelected === 'FEASIBILITY_STUDY' ? 'Ausgewählt' : 'Auswählen'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* PROMOCODE SECTION (Visible when Quick Check is active) */}
                {isQuickCheck && (
                  <div className="bg-surface-container-low border border-surface-dim rounded-xl p-6 mt-6" id="promocode-section">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-label-md text-primary-navy font-sans text-sm">Empfehlungscode</h4>
                        <p className="text-caption text-on-surface-variant text-xs">Mit gültigem Empfehlungscode kann der Quick-Check kostenlos freigeschaltet werden.</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            name="referralCodeUsed"
                            value={formData.referralCodeUsed}
                            onChange={handleChange}
                            placeholder="CODE eingeben" 
                            className="border border-surface-dim rounded-lg px-4 py-2 text-xs font-semibold focus:ring-primary-navy focus:border-primary-navy bg-white text-primary"
                          />
                          <button 
                            type="button"
                            onClick={handleCheckReferral}
                            disabled={checkingReferral || !formData.referralCodeUsed}
                            className="bg-primary-navy text-white px-6 py-2 rounded-lg font-bold text-xs hover:bg-primary-container transition-all disabled:opacity-50"
                          >
                            {checkingReferral ? 'Prüfen...' : 'Einlösen'}
                          </button>
                        </div>
                        {referralMessage && (
                          <p className={`text-[10px] font-bold mt-1 ${referralIsValid ? 'text-emerald-700' : 'text-red-700'}`}>
                            {referralMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Legal & Confirmation disclaimers */}
                <div className="space-y-4 mt-8 max-w-xl text-xs">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={disclaimerAccepted}
                      onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-surface-dim text-primary-navy focus:ring-primary-navy bg-white"
                    />
                    <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors leading-relaxed">
                      Ich bestätige, dass die Angaben nach bestem Wissen korrekt sind und es sich hierbei um eine <strong>städtebauliche Machbarkeits-Vorprüfung</strong> der van Valkenburg GmbH handelt und ausdrücklich nicht um einen offiziellen, rechtsverbindlichen Bauvorbescheid.
                    </span>
                  </label>
                  <div className="bg-surface-container-low p-4 rounded-lg flex items-start gap-3 border border-surface-dim">
                    <span translate="no" className="material-symbols-outlined text-warning-amber">info</span>
                    <p className="text-caption text-on-surface-variant text-[11px] leading-relaxed">Dies ist eine städtebauliche Vorprüfung auf Basis Ihrer Angaben und stellt keine rechtlich verbindliche Baugenehmigung dar.</p>
                  </div>
                </div>

                {/* TRUST BLOCK & PAYMENT NOTICE */}
                <div className="space-y-6 pt-12 border-t border-surface-dim">
                  <div className="bg-surface-container-low rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span translate="no" className="material-symbols-outlined text-accent-teal">verified</span>
                      <span className="text-label-md font-medium text-primary">Sichere Zahlungsabwicklung</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span translate="no" className="material-symbols-outlined text-accent-teal">schedule</span>
                      <span className="text-label-md font-medium text-primary">Analyse startet nach Zahlungseingang</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span translate="no" className="material-symbols-outlined text-accent-teal">description</span>
                      <span className="text-label-md font-medium text-primary">PDF-Report inklusive</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span translate="no" className="material-symbols-outlined text-accent-teal">support_agent</span>
                      <span className="text-label-md font-medium text-primary">Persönliche Beratung je nach Paket</span>
                    </div>
                  </div>

                  <div className="bg-primary-navy/5 border-l-4 border-primary-navy p-6 rounded-r-xl text-xs">
                    <h4 className="font-bold text-label-md text-primary-navy mb-1 text-sm">Wichtiger Hinweis:</h4>
                    <p className="text-body-md text-on-surface-variant">Die Bearbeitung Ihrer Analyse beginnt erst nach Zahlungseingang. Bei <strong>PayPal</strong> erfolgt die Freigabe sofort. Bei <strong>Überweisung</strong> erfolgt die Bearbeitung nach Wertstellung auf unserem Konto (ca. 1-3 Werktage).</p>
                  </div>

                  {checkoutError && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                      {checkoutError}
                    </div>
                  )}

                  {/* PAYMENT METHODS */}
                  {isFree ? (
                    <div className="bg-surface-white border border-surface-dim rounded-2xl p-8 space-y-6 shadow-sm">
                      <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Kostenlose Freischaltung</h3>
                      <button 
                        type="button"
                        onClick={handleFreeSubmit}
                        disabled={!disclaimerAccepted}
                        className="w-full py-4 bg-primary-navy text-white font-bold rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50 text-sm"
                      >
                        Jetzt kostenlos freischalten
                      </button>
                    </div>
                  ) : (
                    <div className="bg-surface-white border border-surface-dim rounded-2xl p-8 space-y-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="text-headline-sm font-headline-sm font-bold text-primary">Zahlungsmethode wählen</h3>
                        <div className="flex gap-3 items-center">
                          <img alt="PayPal" className="h-5 opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1aWjxYL_5qnAPT2_gYFuLuvu_5-IxqXnKoN0GzatSONc-MQ45NYYfKaUdif8MsPdKA-WM1JGgzzT98CE_Z-7ftt-4VE40tb9UF8YB2mng_ulNu0WwMYHbS-RPQGL361eCBNup9gFB9pLkPNcwcrE3QTOoK7OgCHANe4gdUH1Zcbj8mVvKhlZuc3BMRnA4HUaw9ISTtsjcU4uktS4PAguo9NFZNWsIf8muJqwigpqczZbkrGdZU6KF1ECiZ-amkeg0NMSccztuusfi"/>
                          <span translate="no" className="material-symbols-outlined text-on-surface-variant">account_balance</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label 
                          onClick={() => setPaymentMethod('PAYPAL')}
                          className={`bg-surface-white p-5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-colors ${
                            paymentMethod === 'PAYPAL' ? 'border-primary-navy shadow-sm bg-surface-bright' : 'border-surface-dim opacity-80'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio"
                              name="pay"
                              checked={paymentMethod === 'PAYPAL'}
                              onChange={() => setPaymentMethod('PAYPAL')}
                              className="text-primary-navy focus:ring-primary-navy"
                            />
                            <div>
                              <p className="font-bold text-label-md text-primary">PayPal</p>
                              <p className="text-[10px] text-accent-teal font-bold uppercase tracking-wider">Sofort-Freischaltung</p>
                            </div>
                          </div>
                        </label>
                        <label 
                          onClick={() => setPaymentMethod('BANK_TRANSFER')}
                          className={`bg-surface-white p-5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-colors ${
                            paymentMethod === 'BANK_TRANSFER' ? 'border-primary-navy shadow-sm bg-surface-bright' : 'border-surface-dim opacity-80 hover:bg-surface-container-low'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio"
                              name="pay"
                              checked={paymentMethod === 'BANK_TRANSFER'}
                              onChange={() => setPaymentMethod('BANK_TRANSFER')}
                              className="text-primary-navy focus:ring-primary-navy"
                            />
                            <div>
                              <p className="font-bold text-label-md text-primary">Überweisung</p>
                              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Vorkasse</p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {paymentMethod === 'PAYPAL' && (
                        <div className={`mt-6 transition-opacity duration-200 ${!disclaimerAccepted ? 'opacity-40 pointer-events-none' : ''}`}>
                          <PayPalButtons
                            forceReRender={[totalPrice]}
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                intent: 'CAPTURE',
                                purchase_units: [
                                  {
                                    amount: {
                                      currency_code: 'EUR',
                                      value: totalPrice.toFixed(2)
                                    },
                                    description: `mein-baupotenzial.de - Paket: ${formData.packageSelected}`
                                  }
                                ]
                              });
                            }}
                            onApprove={async (data, actions) => {
                              if (!actions.order || !leadId) return;
                              try {
                                const captureRes = await fetch('/api/checkout/paypal/capture', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    orderId: data.orderID,
                                    leadId: leadId
                                  })
                                });

                                if (captureRes.ok) {
                                  setCheckoutCompleted(true);
                                } else {
                                  setCheckoutError('Zahlung konnte serverseitig nicht verifiziert werden. Bitte kontaktieren Sie den Support.');
                                }
                              } catch (err) {
                                setCheckoutError('Server-Verbindungsfehler bei Zahlungsverifikation.');
                              }
                            }}
                            onError={() => {
                              setCheckoutError('Fehler bei der Abwicklung mit PayPal.');
                            }}
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-caption text-on-surface-variant bg-surface-container-low/50 p-4 rounded-lg text-[10px] leading-relaxed">
                        <span translate="no" className="material-symbols-outlined text-accent-teal text-sm">verified_user</span>
                        <span>Verschlüsselte SSL-Übertragung. Alle Preise zzgl. 19% MwSt. (Zwischensumme: {price.toFixed(2)} €, MwSt: {vat.toFixed(2)} €, <strong>Gesamt: {totalPrice.toFixed(2)} €</strong>)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* NAVIGATION BUTTONS */}
                <div className="flex justify-between items-center py-12 border-t border-surface-dim">
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="flex items-center gap-2 text-primary-navy font-bold hover:translate-x-[-4px] transition-transform text-xs"
                  >
                    <span translate="no" className="material-symbols-outlined text-sm">arrow_back</span>
                    <span>Zurück</span>
                  </button>

                  {paymentMethod === 'BANK_TRANSFER' && !isFree && (
                    <button 
                      onClick={handleBankTransferSubmit}
                      disabled={!disclaimerAccepted}
                      className="px-12 py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 text-xs"
                    >
                      Jetzt kostenpflichtig beauftragen
                      <span translate="no" className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* WIZARD FORM STEPS */
              <>
              {/* STEP 1: ANALYSIS GOAL */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-headline-md font-headline-md text-primary-navy">Was möchten Sie klären?</h2>
                  <p className="text-body-md text-on-surface-variant mt-2 text-xs">Wählen Sie das primäre städtebauliche Ziel Ihrer Grundstücksprüfung.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
                    {[
                      { val: 'NEUBAU', label: 'Neubau', desc: 'Neues Hauptgebäude errichten.' },
                      { val: 'NACHVERDICHTUNG', label: 'Nachverdichtung', desc: 'Zusätzliche Wohneinheit/en auf bereits bebautem Land.' },
                      { val: 'AUFSTOCKUNG', label: 'Aufstockung', desc: 'Erweiterung bestehender Gebäude nach oben.' },
                      { val: 'TEILUNG', label: 'Teilung / mehrere Einheiten', desc: 'Grundstücksteilung und Parzellierung.' },
                      { val: 'ERSATZNEUBAU', label: 'Ersatzneubau', desc: 'Abbruch und anschließender Wiederaufbau.' },
                      { val: 'SONSTIGES', label: 'Sonstiges', desc: 'Andere planungsrechtliche Fragestellung.' }
                    ].map(goal => (
                      <label 
                        key={goal.val}
                        className={`p-4 rounded-xl border-2 flex flex-col cursor-pointer transition-all ${
                          formData.analysisGoal === goal.val 
                            ? 'border-primary-navy bg-surface-bright ring-1 ring-primary-navy' 
                            : 'border-surface-dim hover:border-primary-navy bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-1">
                          <input 
                            type="radio" 
                            name="analysisGoal" 
                            value={goal.val}
                            checked={formData.analysisGoal === goal.val}
                            onChange={(e) => {
                              handleChange(e);
                              saveLeadData({ ...formData, analysisGoal: goal.val });
                            }}
                            className="text-primary-navy focus:ring-primary-navy"
                          />
                          <span className="font-bold text-primary text-sm font-sans">{goal.label}</span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant pl-6 leading-relaxed">{goal.desc}</span>
                      </label>
                    ))}
                  </div>

                  <div className="max-w-md border-t border-surface-dim pt-4 mt-6">
                    <label className="block text-xs font-bold text-primary mb-1">Was ist Ihre wichtigste Frage? (1â€“2 Sätze)</label>
                    <textarea
                      name="importantQuestion"
                    className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* STEP 2: GRUNDSTÜCKSDATEN */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-headline-md font-headline-md text-primary-navy">Grundstücksdaten (Lage &amp; Bestand)</h2>
                  <p className="text-body-md text-on-surface-variant mt-2 text-xs">Bitte tragen Sie den exakten Standort und die bekannten Grundstücksdaten ein.</p>
                  
                  <div className="space-y-6 max-w-md mt-6">
                    {/* Section: Address */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-primary text-xs border-b border-surface-dim pb-1 font-sans">1. Standort des Grundstücks</h3>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-primary mb-1">Straße *</label>
                          <input 
                            type="text" 
                            name="addressStreet" 
                            value={formData.addressStreet} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Musterstraße"
                            className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-primary mb-1">Hausnummer *</label>
                          <input 
                            type="text" 
                            name="addressNumber" 
                            value={formData.addressNumber} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="14b"
                            className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-primary mb-1">PLZ *</label>
                          <input 
                            type="text" 
                            name="addressZip" 
                            value={formData.addressZip} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="40212"
                            className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-primary mb-1">Ort *</label>
                          <input 
                            type="text" 
                            name="addressCity" 
                            value={formData.addressCity} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Düsseldorf"
                            className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-primary mb-1">Bundesland</label>
                        <select 
                          name="addressState" 
                          value={formData.addressState} 
                          onChange={(e) => {
                            handleChange(e);
                            saveLeadData({ ...formData, addressState: e.target.value });
                          }}
                          className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                        >
                          {['Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'].map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Section: Cadastral district & geoportal link */}
                    <div className="space-y-4 pt-4 border-t border-surface-dim">
                      <h3 className="font-bold text-primary text-xs border-b border-surface-dim pb-1 font-sans">2. Grundbuchdaten (optional)</h3>
                      
                      <div>
                        <label className="block text-xs font-bold text-primary mb-1">Flurstück / Gemarkung (optional)</label>
                        <input 
                          type="text" 
                          name="cadastralDistrict" 
                          value={formData.cadastralDistrict} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="z.B. Gemarkung Altstadt, Flur 4, Flurstück 18/2"
                          className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-primary mb-1">Link zum Geoportal (optional)</label>
                        <input 
                          type="url" 
                          name="geoportalLink" 
                          value={formData.geoportalLink} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="z.B. Link von Boris.NRW o.ä. Portalen"
                          className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                        />
                      </div>
                    </div>

                    {/* Section: Plot area */}
                    <div className="space-y-4 pt-4 border-t border-surface-dim">
                      <h3 className="font-bold text-primary text-xs border-b border-surface-dim pb-1 font-sans">3. Grundstücksfläche</h3>
                      
                      <div>
                        <label className="block text-xs font-bold text-primary mb-1">Grundstücksfläche (in m²) (empfohlen)</label>
                        <input 
                          type="number" 
                          name="plotArea" 
                          value={formData.plotArea || ''} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="z.B. 750"
                          className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                        />
                      </div>
                    </div>

                    {/* Section: Bestand */}
                    <div className="space-y-4 pt-4 border-t border-surface-dim">
                      <h3 className="font-bold text-primary text-xs border-b border-surface-dim pb-1 font-sans">4. Aktuelle Bebauung</h3>
                      
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, plotIsBuilt: false }));
                            saveLeadData({ ...formData, plotIsBuilt: false });
                          }}
                          className={`flex-1 py-3 border-2 rounded-xl font-bold text-xs transition-all ${
                            formData.plotIsBuilt === false ? 'border-primary-navy bg-surface-bright text-primary-navy' : 'border-surface-dim text-on-surface-variant bg-white'
                          }`}
                        >
                          Unbebaut / freie Parzelle
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, plotIsBuilt: true }));
                            saveLeadData({ ...formData, plotIsBuilt: true });
                          }}
                          className={`flex-1 py-3 border-2 rounded-xl font-bold text-xs transition-all ${
                            formData.plotIsBuilt === true ? 'border-primary-navy bg-surface-bright text-primary-navy' : 'border-surface-dim text-on-surface-variant bg-white'
                          }`}
                        >
                          Bebaut / Altbestand
                        </button>
                      </div>

                      {formData.plotIsBuilt && (
                        <div className="space-y-4 pt-2 mt-2">
                          <div>
                            <label className="block text-xs font-bold text-primary mb-1">Gebäudeart</label>
                            <select 
                              name="buildingType" 
                              value={formData.buildingType || ''} 
                              onChange={(e) => {
                                handleChange(e);
                                saveLeadData({ ...formData, buildingType: e.target.value });
                              }}
                              className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs bg-white text-primary font-semibold"
                            >
                              <option value="">Bitte wählen</option>
                              <option value="EFH">Einfamilienhaus (EFH)</option>
                              <option value="MFH">Mehrfamilienhaus (MFH)</option>
                              <option value="COMMERCIAL">Gewerbegebäude</option>
                              <option value="MIXED">gemischte Nutzung</option>
                              <option value="OTHER">Sonstiges</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-primary mb-1">Anzahl Geschosse (optional)</label>
                            <input 
                              type="text" 
                              name="floorsCount" 
                              value={formData.floorsCount || ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="z.B. 2 Geschosse"
                              className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold bg-white text-primary"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-primary mb-1">Ist ein Abriss denkbar?</label>
                            <select 
                              name="demolitionPossible" 
                              value={formData.demolitionPossible || ''} 
                              onChange={(e) => {
                                handleChange(e);
                                saveLeadData({ ...formData, demolitionPossible: e.target.value });
                              }}
                              className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs bg-white text-primary font-semibold"
                            >
                              <option value="">Bitte wählen</option>
                              <option value="YES">ja</option>
                              <option value="NO">nein</option>
                              <option value="DONT_KNOW">unbekannt</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CONTACT DETAILS */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-headline-md font-headline-md text-primary-navy">Kontaktdaten für Rückfragen &amp; Ergebnisse</h2>
                  <p className="text-body-md text-on-surface-variant mt-2 text-xs">Bitte hinterlegen Sie Ihre Kontaktdaten. Felder mit * sind Pflichtfelder.</p>
                  
                  <div className="space-y-4 max-w-md mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-primary mb-1">Vorname *</label>
                        <input 
                          type="text" 
                          name="contactFirstName" 
                          value={formData.contactFirstName} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Maria"
                          className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary mb-1">Nachname *</label>
                        <input 
                          type="text" 
                          name="contactLastName" 
                          value={formData.contactLastName} 
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Musterfrau"
                          className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">E-Mail-Adresse *</label>
                      <input 
                        type="email" 
                        name="contactEmail" 
                        value={formData.contactEmail} 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="name@domain.de"
                        className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Telefonnummer *</label>
                      <input 
                        type="tel" 
                        name="contactPhone" 
                        value={formData.contactPhone} 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+49 (0) 170 1234567"
                        className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Ihre Rolle zum Grundstück *</label>
                      <select 
                        name="contactRole" 
                        value={formData.contactRole} 
                        onChange={(e) => {
                          handleChange(e);
                          saveLeadData({ ...formData, contactRole: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-surface-dim rounded-lg text-xs font-semibold focus:outline-none focus:border-primary-navy focus:ring-1 focus:ring-primary-navy bg-white text-primary"
                        required
                      >
                        <option value="">-- Rolle wählen --</option>
                        <option value="OWNER">Eigentümer</option>
                        <option value="CHILD_HEIR">Kind/Erbe</option>
                        <option value="AUTHORIZED">Bevollmächtigt</option>
                        <option value="OTHER">Sonstiges</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-surface-dim mt-6">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="agbAcceptedStep2"
                          checked={formData.agbAcceptedStep2}
                          onChange={(e) => {
                            handleChange(e);
                            saveLeadData({ ...formData, agbAcceptedStep2: e.target.checked });
                          }}
                          className="rounded border-surface-dim text-primary-navy focus:ring-primary-navy mt-0.5"
                          required
                        />
                        <span className="text-[10px] text-on-surface-variant leading-relaxed">
                          Ich stimme den <Link href="/agb" target="_blank" className="text-primary-navy font-bold hover:underline">Allgemeinen Geschäftsbedingungen (AGB)</Link> und der <Link href="/datenschutz" target="_blank" className="text-primary-navy font-bold hover:underline">Datenschutzerklärung</Link> der van Valkenburg GmbH zu. *
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: FILE UPLOAD */}
              {currentStep === 4 && (
                <div className="space-y-8" id="step-upload">
                  <div className="border-b border-surface-dim pb-4">
                    <h2 className="text-headline-md font-headline-md text-primary-navy">Dokumente &amp; Pläne hochladen</h2>
                    <p className="text-body-md text-on-surface-variant mt-2 text-xs">Um eine präzise Analyse zu gewährleisten, benötigen wir Zugriff auf relevante Unterlagen (Lagepläne, Planungsrecht, Vorhaben).</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'SITE_PLAN', label: 'Lageplan', icon: 'cloud_upload', desc: 'Datei auswählen' },
                      { key: 'ZONING_PLAN', label: 'Bebauungsplan', icon: 'description', desc: 'Datei auswählen' },
                      { key: 'LAND_REGISTRY_EXTRACT', label: 'Grundbuchauszug', icon: 'history_edu', desc: 'Datei auswählen' },
                      { key: 'BUILDING_PLAN', label: 'Bestandspläne', icon: 'architecture', desc: 'Datei auswählen' },
                      { key: 'ADDITIONAL', label: 'Sonstige Dokumente', icon: 'folder_open', desc: 'Datei auswählen' },
                      { key: 'PROPERTY_PHOTO', label: 'Umfeldfotos', icon: 'photo_library', desc: 'Bilder hochladen' },
                    ].map(cat => {
                      const hasFiles = uploadedDocs.some(d => d.category === cat.key);
                      const filesCount = uploadedDocs.filter(d => d.category === cat.key).length;
                      return (
                        <div 
                          key={cat.key}
                          onClick={() => triggerCategoryUpload(cat.key)}
                          className={`group border-2 border-dashed bg-surface-white rounded-xl p-6 transition-all cursor-pointer relative overflow-hidden ${
                            hasFiles ? 'border-accent-teal bg-emerald-50/10' : 'border-ui-steel hover:border-primary-navy'
                          }`}
                        >
                          <span className="absolute top-0 left-0 bg-surface-container-high px-3 py-1 text-[10px] font-bold tracking-wider text-on-surface-variant uppercase rounded-br-lg">
                            {cat.label}
                          </span>
                          
                          <div className="mt-4 flex flex-col items-center text-center">
                            <span className={`material-symbols-outlined text-4xl mb-2 transition-colors ${
                              hasFiles ? 'text-accent-teal' : 'text-ui-steel group-hover:text-primary-navy'
                            }`}>
                              {cat.icon}
                            </span>
                            <p className="font-bold text-label-md text-primary text-xs font-sans">
                              {hasFiles ? `${filesCount} Datei(en) ausgewählt` : cat.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <p className="text-caption text-on-surface-variant text-[11px]">
                      Unterstützte Formate: <span className="font-bold">PDF, JPG, PNG</span> —{' '}
                      <span className="text-primary-navy font-bold">Max. 25 MB pro Datei</span>
                    </p>
                  </div>

                  {/* Hidden single file input */}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />

                  {/* Photo Preview Gallery and Documents List */}
                  <div className="bg-surface-white border border-surface-dim rounded-xl p-6 space-y-6">
                    {/* Images Section */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span translate="no" className="material-symbols-outlined text-primary-navy">photo_camera</span>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Hochgeladene Fotos</h3>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {uploadedDocs.filter(doc => doc.category === 'PROPERTY_PHOTO' || doc.fileName.toLowerCase().endsWith('.jpg') || doc.fileName.toLowerCase().endsWith('.jpeg') || doc.fileName.toLowerCase().endsWith('.png')).map(doc => (
                          <div key={doc.id} className="aspect-square rounded-lg bg-surface-container relative group overflow-hidden border border-outline-variant">
                            <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src={doc.fileUrl} alt={doc.fileName} />
                            <button 
                              type="button"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="absolute bottom-2 right-2 bg-white/90 p-1 rounded-full text-error shadow-sm hover:bg-white transition-colors"
                            >
                              <span translate="no" className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Other Documents Section */}
                    {uploadedDocs.filter(doc => doc.category !== 'PROPERTY_PHOTO' && !doc.fileName.toLowerCase().endsWith('.jpg') && !doc.fileName.toLowerCase().endsWith('.jpeg') && !doc.fileName.toLowerCase().endsWith('.png')).length > 0 && (
                      <div className="border-t border-surface-dim pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span translate="no" className="material-symbols-outlined text-primary-navy">folder_open</span>
                          <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Andere Dokumente</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {uploadedDocs.filter(doc => doc.category !== 'PROPERTY_PHOTO' && !doc.fileName.toLowerCase().endsWith('.jpg') && !doc.fileName.toLowerCase().endsWith('.jpeg') && !doc.fileName.toLowerCase().endsWith('.png')).map(doc => (
                            <div 
                              key={doc.id}
                              className="p-3 bg-surface-bright rounded-lg border border-outline-variant flex justify-between items-center text-xs"
                            >
                              <div className="min-w-0 pr-2">
                                <p className="font-bold text-primary truncate">{doc.fileName}</p>
                                <p className="text-[9px] text-on-surface-variant uppercase font-medium">
                                  {doc.category === 'SITE_PLAN' ? 'Lageplan' 
                                    : doc.category === 'ZONING_PLAN' ? 'Bebauungsplan' 
                                    : doc.category === 'LAND_REGISTRY_EXTRACT' ? 'Grundbuch' 
                                    : doc.category === 'BUILDING_PLAN' ? 'Bestandsplan' 
                                    : 'Sonstiges'} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <a 
                                  href={doc.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-accent-teal font-bold hover:underline"
                                >
                                  Ansehen
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="text-error font-bold hover:underline"
                                >
                                  Löschen
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: SUMMARY */}
              {currentStep === 5 && (
                <div className="space-y-8" id="step-summary">
                  <div className="border-b border-surface-dim pb-4">
                    <h2 className="text-headline-md font-headline-md text-primary-navy">Zusammenfassung</h2>
                    <p className="text-body-md text-on-surface-variant mt-2 text-xs">Bitte prüfen Sie Ihre Angaben vor der Beauftragung.</p>
                  </div>
                  
                  <div className="space-y-4 text-xs">
                    {/* Section: Kontaktdaten */}
                    <div className="bg-surface-white border border-surface-dim rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-label-md flex items-center gap-2 text-primary font-sans text-sm">
                          <span translate="no" className="material-symbols-outlined text-ui-steel text-lg">person</span> Kontaktdaten
                        </h3>
                        <button type="button" onClick={() => handleStepChange(3)} className="text-accent-teal text-caption font-bold hover:underline">Bearbeiten</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
                        <p><span className="text-on-surface-variant">Name:</span> {formData.contactFirstName} {formData.contactLastName} ({formData.contactRole === 'OWNER' ? 'Eigentümer' : formData.contactRole === 'CHILD_HEIR' ? 'Kind/Erbe' : formData.contactRole === 'AUTHORIZED' ? 'Bevollmächtigt' : 'Sonstiges'})</p>
                        <p><span className="text-on-surface-variant">E-Mail:</span> {formData.contactEmail}</p>
                        <p><span className="text-on-surface-variant">Telefon:</span> {formData.contactPhone || 'Keine Angabe'}</p>
                      </div>
                    </div>

                    {/* Section: Grundstück */}
                    <div className="bg-surface-white border border-surface-dim rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-label-md flex items-center gap-2 text-primary font-sans text-sm">
                          <span translate="no" className="material-symbols-outlined text-ui-steel text-lg">location_on</span> Grundstück &amp; Bestand
                        </h3>
                        <button type="button" onClick={() => handleStepChange(2)} className="text-accent-teal text-caption font-bold hover:underline">Bearbeiten</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
                        <p><span className="text-on-surface-variant">Adresse:</span> {formData.addressStreet} {formData.addressNumber}, {formData.addressZip} {formData.addressCity}</p>
                        <p><span className="text-on-surface-variant">Größe:</span> {formData.plotArea ? `${formData.plotArea} m²` : 'Keine Angabe'}</p>
                        <p><span className="text-on-surface-variant">Bestand:</span> {formData.plotIsBuilt ? `Bebaut (${formData.buildingType || 'Altbestand'})` : 'Unbebaut / freie Parzelle'}</p>
                      </div>
                    </div>

                    {/* Section: Planungsziele */}
                    <div className="bg-surface-white border border-surface-dim rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-label-md flex items-center gap-2 text-primary font-sans text-sm">
                          <span translate="no" className="material-symbols-outlined text-ui-steel text-lg">architecture</span> Planungswünsche
                        </h3>
                        <button type="button" onClick={() => handleStepChange(1)} className="text-accent-teal text-caption font-bold hover:underline">Bearbeiten</button>
                      </div>
                      <div className="text-sm">
                        <p><span className="text-on-surface-variant">Ziel:</span> {getWishesText()}</p>
                        {formData.importantQuestion && <p className="mt-2"><span className="text-on-surface-variant">Wichtigste Frage:</span> {formData.importantQuestion}</p>}
                      </div>
                    </div>

                    {/* Section: Uploads */}
                    <div className="bg-surface-white border border-surface-dim rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-label-md flex items-center gap-2 text-primary font-sans text-sm">
                          <span translate="no" className="material-symbols-outlined text-ui-steel text-lg">upload_file</span> Dokumente &amp; Fotos
                        </h3>
                        <button type="button" onClick={() => handleStepChange(4)} className="text-accent-teal text-caption font-bold hover:underline">Bearbeiten</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {uploadedDocs.length === 0 ? (
                          <span className="text-on-surface-variant italic">Keine Dokumente hochgeladen</span>
                        ) : (
                          uploadedDocs.map(doc => (
                            <span key={doc.id} className="bg-surface-container px-3 py-1 rounded-full text-caption border border-surface-dim flex items-center gap-1 font-semibold text-primary">
                              {doc.fileName} <span translate="no" className="material-symbols-outlined text-[14px] text-accent-teal">check</span>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-navy/5 border border-primary-navy/20 rounded-xl p-6 text-xs leading-relaxed max-w-xl">
                    <p className="font-semibold text-primary mb-2">Wichtige Information zur Prüfung:</p>
                    <p>
                      Wir erstellen für Sie eine **städtebauliche Machbarkeits-Vorprüfung**. Diese Einschätzung ist keine rechtlich bindende Zusage der Gemeinde und stellt keine offizielle Baugenehmigungsplanung dar. Sie dient der Klärung Ihrer Potenziale vor weiteren Investitionen.
                    </p>
                  </div>

                  <div className="flex justify-end border-t border-surface-dim pt-6">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(true)}
                      className="bg-primary-navy text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow"
                    >
                      Weiter zur Paketauswahl
                      <span translate="no" className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step Navigation Controls */}
              {!checkoutCompleted && !showCheckout && (
                <div className="flex justify-between items-center py-12 border-t border-surface-dim mt-8">
                  <button
                    type="button"
                    onClick={() => handleStepChange(currentStep - 1)}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 text-primary-navy font-bold hover:translate-x-[-4px] transition-transform disabled:opacity-30 disabled:hover:translate-x-0 text-xs"
                  >
                    <span translate="no" className="material-symbols-outlined text-sm">arrow_back</span>
                    <span>Zurück</span>
                  </button>
                  
                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => handleStepChange(currentStep + 1)}
                      disabled={!isStepValid(currentStep)}
                      className="px-12 py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 text-xs shadow"
                    >
                      Weiter
                      <span translate="no" className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!formData.agbAcceptedStep2}
                      onClick={() => setShowCheckout(true)}
                      className="px-12 py-4 bg-primary-navy text-white font-bold rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 text-xs shadow"
                    >
                      Weiter zur Paketauswahl
                      <span translate="no" className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  )}
                </div>
              )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-surface-dim">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 px-margin-desktop max-w-container-max mx-auto min-h-[64px] text-xs">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="mein-baupotenzial.de Logo" className="h-6 w-auto object-contain" />
            <span className="text-label-md font-bold text-primary">van Valkenburg GmbH</span>
          </div>
          <span className="text-body-md font-body-md text-on-surface-variant opacity-80 mt-2 md:mt-0">© {new Date().getFullYear()} van Valkenburg GmbH. Alle Rechte vorbehalten.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link className="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-opacity opacity-80 hover:opacity-100" href="/impressum">Impressum</Link>
            <Link className="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-opacity opacity-80 hover:opacity-100" href="/datenschutz">Datenschutz</Link>
            <Link className="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-opacity opacity-80 hover:opacity-100" href="/agb">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

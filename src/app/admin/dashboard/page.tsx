'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MaterialIcon from '@/components/MaterialIcon';

interface Lead {
  id: string;
  currentStep: number;
  status: string;
  packageSelected?: string | null;
  referralCodeUsed?: string | null;
  pricePaid?: number | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  createdAt: string;
  updatedAt: string;
  contactFirstName?: string | null;
  contactLastName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  importantQuestion?: string | null;
  addressStreet?: string | null;
  addressNumber?: string | null;
  addressZip?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  analysisGoal?: string | null;
  plotArea?: number | null;
  cadastralDistrict?: string | null;
  existingBuildingsExist?: boolean | null;
  existingBuildingsDetails?: string | null;
  zoningPlanExists?: string | null;
  planningInfoDetails?: string | null;
  projectDetails?: string | null;
  timeline?: string | null;
  budget?: string | null;
  documents?: {
    id: string;
    category: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }[];
}

interface Subscriber {
  id: string;
  email: string;
  name?: string | null;
  source: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [error, setError] = useState('');
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'LEADS' | 'SUBSCRIBERS'>('LEADS');
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [packageFilter, setPackageFilter] = useState('ALL');
  const [hideEmptyDrafts, setHideEmptyDrafts] = useState(true);
  
  // Modal detail state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      } else {
        setError('Leads konnten nicht geladen werden.');
      }
    } catch (err) {
      setError('Verbindung zum Server fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const res = await fetch('/api/admin/subscribers');
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      } else {
        setError('Abonnenten konnten nicht geladen werden.');
      }
    } catch (err) {
      setError('Verbindung zum Server fehlgeschlagen.');
    } finally {
      setLoadingSubscribers(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchLeads();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' && activeTab === 'SUBSCRIBERS') {
      fetchSubscribers();
    }
  }, [status, activeTab]);

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        // Update local state list
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: updated.status } : l));
        // Update selected lead if it's the one open
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, status: updated.status } : null);
        }
      } else {
        alert('Fehler beim Aktualisieren des Status.');
      }
    } catch (err) {
      alert('Verbindung zum Server fehlgeschlagen.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getFilteredLeads = () => {
    return leads.filter(lead => {
      // 0. Hide empty drafts if checked
      if (hideEmptyDrafts) {
        const isEmptyDraft = lead.status === 'DRAFT' && 
                             !lead.analysisGoal && 
                             !lead.contactFirstName && 
                             !lead.contactLastName && 
                             !lead.contactEmail;
        if (isEmptyDraft) return false;
      }

      // 1. Search Query
      const query = searchQuery.toLowerCase();
      const fullName = `${lead.contactFirstName || ''} ${lead.contactLastName || ''}`.toLowerCase();
      const matchesSearch = 
        lead.id.toLowerCase().includes(query) ||
        fullName.includes(query) ||
        (lead.contactEmail || '').toLowerCase().includes(query) ||
        (lead.addressStreet || '').toLowerCase().includes(query) ||
        (lead.addressCity || '').toLowerCase().includes(query) ||
        (lead.addressZip || '').toLowerCase().includes(query);
      
      // 2. Status Filter
      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      
      // 3. Package Filter
      const matchesPackage = packageFilter === 'ALL' || lead.packageSelected === packageFilter;
      
      return matchesSearch && matchesStatus && matchesPackage;
    });
  };

  const handleExportCsv = () => {
    const filtered = getFilteredLeads();
    if (filtered.length === 0) return;

    // Build headers
    const headers = [
      'Lead ID', 'Erstellungsdatum', 'Status', 'Paket', 'Name', 'E-Mail', 'Telefon', 
      'Strasse', 'Hausnummer', 'PLZ', 'Ort', 'Bundesland', 'Zweck', 'Flaeche (qm)', 
      'Gemarkung/Flurstueck', 'Bestehende Bebauung', 'Bebauungsplan', 'Projektbeschreibung', 
      'Zeitrahmen', 'Budget', 'Referral Code', 'Bezahlter Betrag (€)', 'Zahlungsart'
    ];

    // Build rows
    const rows = filtered.map(l => [
      l.id,
      new Date(l.createdAt).toLocaleDateString('de-DE'),
      l.status,
      l.packageSelected || 'Kein Paket',
      `${l.contactFirstName || ''} ${l.contactLastName || ''}`.trim(),
      l.contactEmail || '',
      l.contactPhone || '',
      l.addressStreet || '',
      l.addressNumber || '',
      l.addressZip || '',
      l.addressCity || '',
      l.addressState || '',
      l.analysisGoal || '',
      l.plotArea ? String(l.plotArea) : '',
      l.cadastralDistrict || '',
      l.existingBuildingsExist ? 'Ja' : 'Nein',
      l.zoningPlanExists || '',
      l.projectDetails || '',
      l.timeline || '',
      l.budget || '',
      l.referralCodeUsed || '',
      l.pricePaid ? String(l.pricePaid) : '',
      l.paymentMethod || ''
    ]);

    // Format CSV content
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');

    // Create download link
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredSubscribers = () => {
    return subscribers.filter(s => {
      const query = searchQuery.toLowerCase();
      return (
        s.email.toLowerCase().includes(query) ||
        (s.name || '').toLowerCase().includes(query) ||
        s.source.toLowerCase().includes(query)
      );
    });
  };

  const handleExportSubscribersCsv = () => {
    const filtered = getFilteredSubscribers();
    if (filtered.length === 0) return;
    const headers = ['E-Mail', 'Name', 'Anmeldequelle', 'Registrierungsdatum'];
    const rows = filtered.map(s => [
      s.email,
      s.name || '',
      s.source,
      new Date(s.createdAt).toLocaleDateString('de-DE')
    ]);
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <MaterialIcon name="sync" className="text-secondary mb-4" size={36} />
            <p className="text-sm font-semibold text-primary">Leads werden geladen...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredLeads = getFilteredLeads();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary font-sans">
              {activeTab === 'LEADS' ? 'Lead-Management Dashboard' : 'Newsletter-Abonnenten'}
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              {activeTab === 'LEADS' 
                ? 'Verwalten und prüfen Sie alle eingegangenen Grundstücksanfragen.' 
                : 'Verwalten und exportieren Sie Ihre Newsletter-Kontakte.'}
            </p>
          </div>
          {activeTab === 'LEADS' ? (
            <button 
              onClick={handleExportCsv}
              disabled={filteredLeads.length === 0}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
            >
              <MaterialIcon name="download" size={16} />
              CSV Export ({filteredLeads.length})
            </button>
          ) : (
            <button 
              onClick={handleExportSubscribersCsv}
              disabled={getFilteredSubscribers().length === 0}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
            >
              <MaterialIcon name="download" size={16} />
              CSV Export ({getFilteredSubscribers().length})
            </button>
          )}
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-surface-dim mb-6">
          <button
            onClick={() => {
              setActiveTab('LEADS');
              setSearchQuery('');
            }}
            className={`px-6 py-3 font-sans font-bold text-xs border-b-2 transition-all ${
              activeTab === 'LEADS'
                ? 'border-secondary text-secondary bg-surface-white'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Bestellungen / Anfragen ({leads.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('SUBSCRIBERS');
              setSearchQuery('');
            }}
            className={`px-6 py-3 font-sans font-bold text-xs border-b-2 transition-all ${
              activeTab === 'SUBSCRIBERS'
                ? 'border-secondary text-secondary bg-surface-white'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Newsletter-Abonnenten ({subscribers.length})
          </button>
        </div>

        {activeTab === 'LEADS' ? (
          <>
            {/* Filters and search */}
            <div className="bg-surface-white p-6 rounded-2xl border border-surface-dim shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="md:col-span-2 relative">
                <label className="block text-xs font-bold text-primary mb-1">Suche</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Name, E-Mail, Straße, ID..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-surface-dim focus:outline-none focus:border-secondary text-xs text-primary font-medium bg-[#F5F7FA]"
                  />
                  <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary text-xs bg-white text-primary font-medium"
                >
                  <option value="ALL">Alle Status</option>
                  <option value="DRAFT">Entwurf (Draft)</option>
                  <option value="COMPLETED">Eingereicht (Completed)</option>
                  <option value="PAID">Bezahlt (Paid)</option>
                  <option value="IN_REVIEW">In Prüfung (In Review)</option>
                  <option value="DELIVERED">Ausgeliefert (Delivered)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">Paket</label>
                <select 
                  value={packageFilter}
                  onChange={(e) => setPackageFilter(e.target.value)}
                  className="w-full h-10 px-3 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary text-xs bg-white text-primary font-medium"
                >
                  <option value="ALL">Alle Pakete</option>
                  <option value="QUICK_CHECK">Quick Check</option>
                  <option value="POTENTIAL_ANALYSIS">Potenzialanalyse</option>
                  <option value="FEASIBILITY_STUDY">Machbarkeitsstudie</option>
                </select>
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={hideEmptyDrafts}
                    onChange={(e) => setHideEmptyDrafts(e.target.checked)}
                    className="w-4 h-4 rounded text-secondary border-surface-dim focus:ring-secondary cursor-pointer"
                  />
                  <span className="text-xs font-bold text-primary">Leere Entwürfe ausblenden</span>
                </label>
              </div>
            </div>

            {/* Lead entries table */}
            <div className="bg-surface-white rounded-2xl border border-surface-dim shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#112030] text-[#ECEEF1] text-xs font-bold font-sans uppercase">
                      <th className="py-4 px-6">ID / Datum</th>
                      <th className="py-4 px-6">Kunde</th>
                      <th className="py-4 px-6">Adresse</th>
                      <th className="py-4 px-6">Paket</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-dim text-xs">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-on-surface-variant font-medium">
                          Keine Leads gefunden.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map(lead => (
                        <tr 
                          key={lead.id}
                          className="hover:bg-[#F5F7FA] transition-colors cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <td className="py-4 px-6">
                            <div className="font-bold text-primary font-mono">{lead.id.substring(0, 8)}</div>
                            <div className="text-[10px] text-on-surface-variant mt-0.5">{new Date(lead.createdAt).toLocaleDateString('de-DE')}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-primary">
                              {(lead.contactFirstName || lead.contactLastName) 
                                ? `${lead.contactFirstName || ''} ${lead.contactLastName || ''}`.trim() 
                                : 'Entwurf'}
                            </div>
                            <div className="text-on-surface-variant mt-0.5">{lead.contactEmail || 'N/A'}</div>
                          </td>
                          <td className="py-4 px-6 max-w-[180px] truncate">
                            {lead.addressStreet ? (
                              <>
                                <div>{lead.addressStreet} {lead.addressNumber}</div>
                                <div className="text-on-surface-variant">{lead.addressZip} {lead.addressCity}</div>
                              </>
                            ) : (
                              <span className="text-surface-dim italic">Keine Adresse</span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-semibold">
                            {lead.packageSelected === 'QUICK_CHECK' ? 'Quick Check'
                              : lead.packageSelected === 'POTENTIAL_ANALYSIS' ? 'Potenzialanalyse'
                              : lead.packageSelected === 'FEASIBILITY_STUDY' ? 'Machbarkeitsstudie'
                              : 'Ausstehend'}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              lead.status === 'PAID' ? 'bg-emerald-100 text-emerald-800'
                                : lead.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800'
                                : lead.status === 'IN_REVIEW' ? 'bg-amber-100 text-amber-800'
                                : lead.status === 'DELIVERED' ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {lead.status === 'PAID' ? 'Bezahlt'
                                : lead.status === 'COMPLETED' ? 'Eingereicht'
                                : lead.status === 'IN_REVIEW' ? 'In Prüfung'
                                : lead.status === 'DELIVERED' ? 'Ausgeliefert'
                                : 'Entwurf'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="inline-flex gap-2">
                              <button 
                                onClick={() => setSelectedLead(lead)}
                                className="bg-surface-bright border border-surface-dim hover:bg-surface-container text-primary px-3 py-1 rounded font-bold text-[10px]"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Subscriber search filter */}
            <div className="bg-surface-white p-6 rounded-2xl border border-surface-dim shadow-sm flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <label className="block text-xs font-bold text-primary mb-1">Abonnenten-Suche</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Name, E-Mail-Adresse..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-surface-dim focus:outline-none focus:border-secondary text-xs text-primary font-medium bg-[#F5F7FA]"
                  />
                  <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                </div>
              </div>
            </div>

            {/* Subscriber table */}
            <div className="bg-surface-white rounded-2xl border border-surface-dim shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                {loadingSubscribers ? (
                  <div className="text-center py-12">
                    <MaterialIcon name="sync" className="text-secondary mb-4" size={36} />
                    <p className="text-sm font-semibold text-primary font-sans">Abonnenten werden geladen...</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#112030] text-[#ECEEF1] text-xs font-bold font-sans uppercase">
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">E-Mail-Adresse</th>
                        <th className="py-4 px-6">Quelle</th>
                        <th className="py-4 px-6">Registrierungsdatum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-dim text-xs">
                      {getFilteredSubscribers().length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-on-surface-variant font-medium">
                            Keine Abonnenten gefunden.
                          </td>
                        </tr>
                      ) : (
                        getFilteredSubscribers().map(sub => (
                          <tr key={sub.id} className="hover:bg-[#F5F7FA] transition-colors">
                            <td className="py-4 px-6 font-bold text-primary">
                              {sub.name || <span className="text-surface-dim italic">Kein Name</span>}
                            </td>
                            <td className="py-4 px-6 font-mono font-medium text-primary">
                              {sub.email}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                sub.source === 'CHECKOUT' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {sub.source === 'CHECKOUT' ? 'Bestell-Wizard' : 'Newsletter-Formular'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-on-surface-variant">
                              {new Date(sub.createdAt).toLocaleString('de-DE')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {/* Lead detail drawer/modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
            <div className="bg-surface-white w-full max-w-2xl h-full shadow-2xl p-8 overflow-y-auto flex flex-col justify-between border-l border-surface-dim">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-secondary uppercase">Lead Details</span>
                    <h2 className="text-xl font-bold text-primary font-mono">{selectedLead.id}</h2>
                    <p className="text-[10px] text-on-surface-variant">Erstellt am: {new Date(selectedLead.createdAt).toLocaleString('de-DE')}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedLead(null)}
                    className="text-on-surface-variant hover:text-primary"
                  >
                    <MaterialIcon name="close" />
                  </button>
                </div>

                <div className="space-y-6 text-xs leading-relaxed border-t border-surface-dim pt-6">
                  {/* Status update box */}
                  <div className="bg-[#ccfbf1]/20 p-4 rounded-xl border border-secondary/20 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="font-bold text-primary">Status anpassen:</span>
                      <p className="text-[10px] text-on-surface-variant">Dies schickt entsprechende E-Mails an den Kunden.</p>
                    </div>
                    <select
                      value={selectedLead.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value)}
                      className="px-3 py-1.5 border border-surface-dim rounded text-xs bg-white font-bold"
                    >
                      <option value="DRAFT">Entwurf (Draft)</option>
                      <option value="COMPLETED">Eingereicht (Completed)</option>
                      <option value="PAID">Bezahlt (Paid)</option>
                      <option value="IN_REVIEW">In Prüfung (In Review)</option>
                      <option value="DELIVERED">Ausgeliefert (Delivered)</option>
                    </select>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h3 className="font-bold text-primary text-sm mb-2 font-sans border-b border-surface-dim pb-1">Kundendaten</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <p><strong>Name:</strong> {(selectedLead.contactFirstName || selectedLead.contactLastName) ? `${selectedLead.contactFirstName || ''} ${selectedLead.contactLastName || ''}`.trim() : '-'}</p>
                      <p><strong>E-Mail:</strong> {selectedLead.contactEmail || '-'}</p>
                      <p><strong>Telefon:</strong> {selectedLead.contactPhone || '-'}</p>
                      <p><strong>Zweck:</strong> {selectedLead.analysisGoal || '-'}</p>
                      {selectedLead.importantQuestion && (
                        <p className="col-span-2 text-xs bg-surface-bright p-3 rounded-lg border border-surface-dim mt-1">
                          <strong className="block text-primary mb-1">Wichtigste Frage:</strong>
                          <span className="italic text-on-surface-variant font-sans">{selectedLead.importantQuestion}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="font-bold text-primary text-sm mb-2 font-sans border-b border-surface-dim pb-1">Adresse</h3>
                    <p>
                      {selectedLead.addressStreet || '-'} {selectedLead.addressNumber || ''}<br />
                      {selectedLead.addressZip || ''} {selectedLead.addressCity || ''}<br />
                      {selectedLead.addressState || ''}
                    </p>
                  </div>

                  {/* Property details */}
                  <div>
                    <h3 className="font-bold text-primary text-sm mb-2 font-sans border-b border-surface-dim pb-1">Grundstücksdetails</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <p><strong>Fläche (qm):</strong> {selectedLead.plotArea || '-'}</p>
                      <p><strong>Flurstück/Gemarkung:</strong> {selectedLead.cadastralDistrict || '-'}</p>
                      <p><strong>Bebauungsplan vorh.?</strong> {selectedLead.zoningPlanExists || '-'}</p>
                      <p><strong>Altbestand vorh.?</strong> {selectedLead.existingBuildingsExist ? 'Ja' : 'Nein'}</p>
                    </div>
                    {selectedLead.existingBuildingsExist && (
                      <p className="mt-2"><strong>Altbestand Beschreibung:</strong> {selectedLead.existingBuildingsDetails}</p>
                    )}
                    {selectedLead.planningInfoDetails && (
                      <p className="mt-2"><strong>Planungsrechtliche Info:</strong> {selectedLead.planningInfoDetails}</p>
                    )}
                  </div>

                  {/* Project info */}
                  <div>
                    <h3 className="font-bold text-primary text-sm mb-2 font-sans border-b border-surface-dim pb-1">Vorhaben &amp; Budget</h3>
                    <p><strong>Beschreibung:</strong> {selectedLead.projectDetails || '-'}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <p><strong>Zeitraum:</strong> {selectedLead.timeline || '-'}</p>
                      <p><strong>Budget:</strong> {selectedLead.budget || '-'}</p>
                    </div>
                  </div>

                  {/* Checkout info */}
                  <div>
                    <h3 className="font-bold text-primary text-sm mb-2 font-sans border-b border-surface-dim pb-1">Zahlungsinformationen</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <p><strong>Paket:</strong> {selectedLead.packageSelected || '-'}</p>
                      <p><strong>Referral Code:</strong> {selectedLead.referralCodeUsed || '-'}</p>
                      <p><strong>Bezahlter Betrag:</strong> {selectedLead.pricePaid ? `${selectedLead.pricePaid} €` : '-'}</p>
                      <p><strong>Zahlungsmethode:</strong> {selectedLead.paymentMethod || '-'}</p>
                    </div>
                  </div>

                  {/* Uploaded Files */}
                  <div>
                    <h3 className="font-bold text-primary text-sm mb-2 font-sans border-b border-surface-dim pb-1">Grundstücksunterlagen</h3>
                    {!selectedLead.documents || selectedLead.documents.length === 0 ? (
                      <p className="text-on-surface-variant italic">Keine Unterlagen hochgeladen.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedLead.documents.map(doc => (
                          <div 
                            key={doc.id}
                            className="bg-surface-bright border border-surface-dim p-3 rounded-lg flex justify-between items-center"
                          >
                            <div className="truncate pr-3">
                              <span className="font-bold text-primary block truncate">{doc.fileName}</span>
                              <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                                {doc.category} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                            <a 
                              href={doc.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-secondary font-bold hover:underline shrink-0 font-sans"
                            >
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-surface-dim pt-4 mt-8 flex justify-end">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-bold"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

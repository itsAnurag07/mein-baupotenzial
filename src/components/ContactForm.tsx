'use client';

import React, { useState } from 'react';
import MaterialIcon from './MaterialIcon';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Fehler beim Senden der Nachricht.');
        setStatus('error');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMessage('Verbindung zum Server fehlgeschlagen. Bitte versuchen Sie es später noch einmal.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50/50 border border-emerald-200 p-8 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <MaterialIcon name="check_circle" size={28} />
        </div>
        <h3 className="text-lg font-bold text-primary">Nachricht gesendet!</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Vielen Dank für Ihre Anfrage. Wir haben Ihre Nachricht erhalten und werden uns so schnell wie möglich bei Ihnen melden.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 px-6 py-2 border border-emerald-300 text-emerald-700 rounded-lg text-xs font-semibold hover:bg-emerald-50 transition-colors"
        >
          Weitere Nachricht senden
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-white p-8 rounded-2xl border border-surface-dim shadow-sm">
      <h2 className="text-xl font-bold text-primary mb-6">Schreiben Sie uns</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
            <MaterialIcon name="error" className="text-red-500 shrink-0" size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-primary mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary bg-white text-primary text-sm"
            placeholder="Ihr Name"
            required
            disabled={status === 'submitting'}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-1">E-Mail-Adresse</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary bg-white text-primary text-sm"
            placeholder="ihre.email@beispiel.de"
            required
            disabled={status === 'submitting'}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-1">Betreff</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary bg-white text-primary text-sm"
            placeholder="Betreff"
            required
            disabled={status === 'submitting'}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary mb-1">Ihre Nachricht</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary bg-white text-primary text-sm"
            placeholder="Wie können wir Ihnen helfen?"
            required
            disabled={status === 'submitting'}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'submitting' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Wird gesendet...</span>
            </>
          ) : (
            <span>Nachricht absenden</span>
          )}
        </button>
      </form>
    </div>
  );
}

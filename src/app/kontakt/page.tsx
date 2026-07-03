import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function KontaktPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-6">Kontaktieren Sie uns</h1>
        <p className="text-lg text-on-surface-variant mb-12">
          Haben Sie Fragen zu unseren Analyse-Paketen oder benÃ¶tigen Sie UnterstÃ¼tzung bei Ihrer Bestellung? Unser Team steht Ihnen gerne zur VerfÃ¼gung.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-surface-white p-8 rounded-2xl border border-surface-dim shadow-sm">
            <h2 className="text-xl font-bold text-primary mb-6">Schreiben Sie uns</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary" 
                  placeholder="Ihr Name"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-primary mb-1">E-Mail-Adresse</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary" 
                  placeholder="ihre.email@beispiel.de"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">Betreff</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary" 
                  placeholder="Betreff"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1">Ihre Nachricht</label>
                <textarea 
                  rows={4} 
                  className="w-full px-4 py-2 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary" 
                  placeholder="Wie kÃ¶nnen wir Ihnen helfen?"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-95 transition-opacity"
              >
                Nachricht absenden
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-surface-white p-8 rounded-2xl border border-surface-dim shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4">Firmensitz</h2>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                <strong>van Valkenburg GmbH</strong><br />
                KÃ¶nigsallee 60F<br />
                40212 DÃ¼sseldorf<br />
                Deutschland
              </p>
            </div>

            <div className="bg-surface-white p-8 rounded-2xl border border-surface-dim shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4">Direkter Kontakt</h2>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <p><strong>E-Mail:</strong> info@mein-baupotenzial.de</p>
                <p><strong>Telefon:</strong> +49 (0) 211 1234567</p>
                <p><strong>BÃ¼rozeiten:</strong> Mo. - Fr. 09:00 - 17:00 Uhr</p>
              </div>
            </div>

            <div className="p-4 bg-secondary-container text-on-secondary-container rounded-xl text-xs leading-relaxed">
              <strong>Hinweis:</strong> Dies ist das Kontaktformular der van Valkenburg GmbH fÃ¼r die Plattform mein-baupotenzial.de. Wir erbringen stÃ¤dtebauliche Beratungen. Eine Architekten- oder Rechtsdienstleistung ist hiermit nicht verbunden.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

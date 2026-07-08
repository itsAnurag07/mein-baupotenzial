'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password
      });

      if (result?.error) {
        setError('Ungültiger Benutzername oder Passwort.');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError('Verbindung zum Server fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="bg-surface-white rounded-2xl border border-surface-dim p-8 shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-primary mb-6 text-center font-sans">Admin Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Benutzername</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Benutzername"
                className="w-full px-4 py-2 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Passwort</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort"
                className="w-full px-4 py-2 border border-surface-dim rounded-lg focus:outline-none focus:border-secondary text-sm"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-95 transition-opacity disabled:opacity-50 text-sm mt-6"
            >
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

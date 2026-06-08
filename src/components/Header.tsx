'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-surface-white border-b border-surface-dim sticky top-0 z-50 transition-all duration-200 ease-in-out">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-7xl mx-auto h-16">
        <div className="flex items-center">
          <Link href="/" className="hover:opacity-95 flex items-center">
            <img src="/logo.png" alt="mein-baupotenzial.de Logo" className="h-11 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/analyse" className="text-primary font-bold border-b-2 border-secondary text-sm py-1">
            Analyse starten
          </Link>
          <Link href="/#preise" className="text-on-surface-variant hover:text-secondary transition-colors text-sm py-1 font-medium">
            Preise
          </Link>
          <Link href="/#ueber-uns" className="text-on-surface-variant hover:text-secondary transition-colors text-sm py-1 font-medium">
            Über uns
          </Link>
          <Link href="/#faq" className="text-on-surface-variant hover:text-secondary transition-colors text-sm py-1 font-medium">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/admin/dashboard" className="text-sm font-semibold text-secondary hover:underline">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-surface-bright border border-surface-dim text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <Link
                href="/admin/dashboard"
                className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-surface-bright transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü öffnen"
          >
            <span className={`block w-5 h-0.5 bg-primary rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-primary rounded-full transition-all duration-300 mt-1 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-primary rounded-full transition-all duration-300 mt-1 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 border-t border-surface-dim' : 'max-h-0'}`}>
        <nav className="flex flex-col px-4 py-4 bg-surface-white gap-1">
          <Link
            href="/analyse"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-on-primary bg-primary hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
            Analyse starten
          </Link>
          <Link
            href="/#preise"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-surface-bright transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">payments</span>
            Preise
          </Link>
          <Link
            href="/#ueber-uns"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-surface-bright transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">info</span>
            Über uns
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-surface-bright transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">help</span>
            FAQ
          </Link>

          <div className="border-t border-surface-dim mt-2 pt-3 px-4">
            {session ? (
              <div className="flex items-center justify-between">
                <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-secondary hover:underline">
                  Dashboard
                </Link>
                <button
                  onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false); }}
                  className="bg-surface-bright border border-surface-dim text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors"
                >
                  Abmelden
                </button>
              </div>
            ) : (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-surface-bright border border-surface-dim text-primary px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-surface-container transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

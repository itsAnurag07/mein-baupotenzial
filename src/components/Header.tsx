'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Layers,
  Route,
  GraduationCap,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';

const NAV = [
  { href: '/analyse',           label: 'Analyse starten' },
  { href: '/#leistungen',       label: 'Leistungen' },
  { href: '/#so-funktionierts', label: "So funktioniert's" },
  { href: '/#wissen',           label: 'Wissen' },
  { href: '/#faq',              label: 'FAQ' },
];

const NAV_ICONS = [
  <Building2 size={18} strokeWidth={2} />,
  <Layers     size={18} strokeWidth={2} />,
  <Route      size={18} strokeWidth={2} />,
  <GraduationCap size={18} strokeWidth={2} />,
  <HelpCircle size={18} strokeWidth={2} />,
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`bg-surface-white sticky top-0 z-50 transition-all duration-[250ms] ${
        scrolled ? 'shadow-soft border-b border-surface-dim' : 'border-b border-surface-dim'
      }`}
    >
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-[1440px] mx-auto h-20">

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity duration-[120ms] flex items-center">
            <img
              src="/logo.png"
              alt="mein-baupotenzial.de Logo"
              className="object-contain"
              style={{ maxHeight: '44px', width: 'auto' }}
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-on-surface-variant hover:text-primary transition-colors duration-[120ms] text-sm font-medium py-1"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="/analyse"
            className="inline-flex items-center gap-2 bg-secondary text-on-secondary font-semibold text-[15px] hover:bg-cta-hover transition-colors duration-[120ms]"
            style={{ height: '48px', paddingLeft: '24px', paddingRight: '24px', borderRadius: '14px' }}
          >
            <Building2 size={17} strokeWidth={2} />
            Grundstück analysieren
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-bright transition-colors duration-[120ms] text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menü öffnen"
        >
          {mobileMenuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-[250ms] ease-in-out ${
          mobileMenuOpen ? 'max-h-[500px] border-t border-surface-dim' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col px-4 py-4 bg-surface-white gap-1">
          <Link
            href="/analyse"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-semibold text-on-secondary bg-secondary hover:bg-cta-hover transition-colors duration-[120ms]"
            style={{ borderRadius: '14px' }}
          >
            <Building2 size={18} strokeWidth={2} />
            Grundstück analysieren
          </Link>

          {NAV.slice(1).map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-primary hover:bg-surface-bright transition-colors duration-[120ms]"
              style={{ borderRadius: '12px' }}
            >
              <span className="text-on-surface-variant">{NAV_ICONS[i + 1]}</span>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

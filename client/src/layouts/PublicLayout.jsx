import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logoImg from '../assets/logo.jpeg';

const PublicLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative overflow-hidden selection:bg-primary-container selection:text-on-primary-container transition-colors duration-300">
      {/* Background glow effects - softer and elegant */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary-fixed-dim/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-[72px] bg-background/80 backdrop-blur-md border-b border-outline/10 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-md md:px-lg flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-sm group">
            <img
              src={logoImg}
              alt="PhoneBook"
              className="h-9 w-9 rounded-full object-cover border border-primary/20 shadow-[0_0_12px_rgba(var(--color-primary-container),0.15)] group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-headline-md text-[18px] text-primary tracking-wide font-bold">PhoneBook</span>
          </Link>

          {/* Desktop Controls & Auth Buttons */}
          <div className="hidden md:flex items-center gap-md">
            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-xs text-on-surface-variant hover:text-primary transition-colors rounded-lg flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-symbols-outlined text-[22px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Login / Register */}
            <Link to="/login" className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors px-sm py-xs">
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-xs bg-primary-container hover:bg-primary-container/90 text-on-primary-container px-lg py-sm rounded-full font-label-lg text-label-lg transition-all duration-300 shadow-[0_0_16px_rgba(var(--color-primary-container),0.3)] hover:shadow-[0_0_24px_rgba(var(--color-primary-container),0.5)] hover:scale-105 active:scale-95 font-semibold"
            >
              Get Started
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-sm">
            {/* Theme Toggle for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Hamburger Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-on-surface hover:text-primary transition-colors p-xs"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="absolute top-[72px] left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-outline/10 flex flex-col p-md gap-md md:hidden shadow-xl z-40 animate-fade-in">
            <div className="flex flex-col gap-sm">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="h-10 border border-outline/20 hover:bg-surface-variant/30 text-on-surface rounded-full flex items-center justify-center font-label-lg text-label-lg transition-all font-semibold active:scale-95"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="h-10 bg-primary-container hover:bg-primary-container/90 text-on-primary-container rounded-full flex items-center justify-center gap-xs font-label-lg text-label-lg shadow-[0_0_16px_rgba(var(--color-primary-container),0.3)] font-semibold active:scale-95 transition-all"
              >
                Get Started
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pt-[72px] w-full max-w-7xl mx-auto px-md md:px-lg relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-outline/10 bg-surface-container-low/30 py-xl mt-xl relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-md md:px-lg grid grid-cols-1 md:grid-cols-3 gap-xl">
          <div className="space-y-md md:col-span-2">
            <div className="flex items-center gap-sm">
              <img src={logoImg} alt="PhoneBook" className="h-8 w-8 rounded-full object-cover border border-primary/20" />
              <span className="font-headline-sm text-headline-sm text-primary font-bold">PhoneBook</span>
            </div>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              Enterprise-grade smart directory engine. Designed with ultra-fast search suggestions, customizable tag systems, and strict client data privacy isolation.
            </p>
          </div>
          <div className="space-y-sm">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Enterprise</h4>
            <ul className="space-y-xs text-xs text-on-surface-variant">
              <li><span className="opacity-60">Status: Active Node</span></li>
              <li><span className="opacity-60">Version: 1.0.0</span></li>
              <li><span className="opacity-60">Data Privacy: Isolated Node</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-md md:px-lg border-t border-outline/5 mt-lg pt-md flex flex-col md:flex-row items-center justify-between gap-sm text-[11px] text-on-surface-variant">
          {/* Left: Privacy policy and terms of service */}
          <div className="flex gap-md order-2 md:order-1">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>

          {/* Middle: all rights reserved */}
          <div className="order-1 md:order-2">
            <span>&copy; {new Date().getFullYear()} PhoneBook. All rights reserved.</span>
          </div>

          {/* Right: developed by card with portfolio link */}
          <div className="order-3 md:order-3">
            <a
              href="https://shivanandvn.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-xs px-sm py-[6px] bg-surface-container-high/40 hover:bg-primary-container/20 border border-outline/10 rounded-lg text-[10px] font-semibold text-primary transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[12px]">code</span>
              <span>Developed by Shivanand VN</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

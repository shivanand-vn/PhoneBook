import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: 'search',
      title: 'Smart Search',
      desc: 'Lightning-fast fuzzy search across names, emails, companies, and tags with instant results.'
    },
    {
      icon: 'bolt',
      title: 'Real-Time Suggestions',
      desc: 'Auto-complete contact suggestions as you type, powered by intelligent query matching.'
    },
    {
      icon: 'analytics',
      title: 'Contact Analytics',
      desc: 'Visual dashboards with company distribution charts, growth metrics, and activity timelines.'
    },
    {
      icon: 'star',
      title: 'Favorites & Tags',
      desc: 'Organize contacts with star-based favorites and customizable tagging segments.'
    },
    {
      icon: 'cloud_upload',
      title: 'Cloud Image Storage',
      desc: 'Securely upload and manage profile avatars with automatic Cloudinary integration.'
    }
  ];

  return (
    <div className="w-full">
      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="py-xl md:py-[100px] relative">
        {/* Hero glow */}
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(var(--color-primary-container),0.08) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Chip badge */}
          <div className="flex items-center gap-xs bg-surface-container-high border border-outline-variant/15 rounded-full px-md py-xs mb-lg">
            <span className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse" />
            <span className="text-[11px] font-semibold text-primary-fixed-dim uppercase tracking-widest">Enterprise Directory Engine</span>
          </div>

          <h1 className="font-headline-xl text-headline-xl text-primary mb-md leading-tight">
            Smart Contact<br />
            <span className="text-primary-fixed-dim font-bold">Intelligence Platform</span>
          </h1>

          <p className="text-on-surface-variant text-base md:text-lg max-w-xl leading-relaxed mb-xl">
            AI-powered phonebook management with enterprise-grade analytics, real-time search suggestions, and secure private workspaces — built for teams that move fast.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-md">
            <Link
              to="/register"
              className="h-12 px-xl bg-primary-container text-on-primary-container rounded-full font-label-lg text-label-lg transition-all duration-300 flex items-center justify-center gap-sm shadow-[0_0_20px_rgba(var(--color-primary-container),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary-container),0.5)] hover:scale-105 active:scale-95 font-bold"
            >
              Get Started Free
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              to="/login"
              className="h-12 px-xl border border-outline/25 hover:bg-surface-container-high/50 text-on-surface rounded-full font-label-lg text-label-lg transition-all duration-300 flex items-center justify-center gap-sm hover:scale-105 active:scale-95 font-bold"
            >
              Sign In
              <span className="material-symbols-outlined text-[18px]">login</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="relative z-10 mt-xl md:mt-[80px] max-w-4xl mx-auto">
          <div className="bg-surface-container-low/60 border border-outline/10 rounded-xl p-xs md:p-sm shadow-[0_16px_64px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_64px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden">
            {/* Fake titlebar */}
            <div className="flex items-center gap-xs mb-sm md:mb-md px-sm pt-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-error/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim/40" />
              <span className="ml-sm text-[10px] text-on-surface-variant/60 tracking-wider">PhoneBook — Contacts Directory</span>
            </div>

            {/* Real App Screenshot */}
            <div className="rounded-lg overflow-hidden border border-outline/5 relative shadow-inner bg-black/20">
              <img
                src="/landing_demo.png"
                alt="PhoneBook Contacts Directory"
                className="w-full h-auto object-cover max-h-[480px] hover:scale-[1.01] transition-transform duration-700"
              />
            </div>
          </div>

          {/* Glow under the card */}
          <div className="absolute -bottom-8 left-[10%] right-[10%] h-16 rounded-full blur-2xl bg-primary-container/5 pointer-events-none" />
        </div>
      </section>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <section id="features" className="py-xl md:py-[80px]">
        <div className="text-center mb-xl">
          <span className="text-[11px] font-semibold text-primary-fixed-dim uppercase tracking-widest">Platform Capabilities</span>
          <h2 className="font-headline-lg text-headline-lg text-primary mt-sm">Everything You Need</h2>
          <p className="text-sm text-on-surface-variant mt-xs max-w-md mx-auto">Purpose-built tools for managing, searching, and analyzing your contact directory at scale.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-md">
          {features.map((feat, i) => (
            <div
              key={i}
              className="group bg-surface-container-low/50 border border-outline/8 rounded-xl p-lg hover:border-primary-container/25 transition-all duration-300 hover:shadow-[0_0_24px_rgba(var(--color-primary-container),0.06)] w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/15 flex items-center justify-center mb-md group-hover:bg-primary-container/10 transition-colors">
                <span className="material-symbols-outlined text-[20px] text-primary">{feat.icon}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-xs">{feat.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="py-xl md:py-[80px]">
        <div className="relative max-w-3xl mx-auto bg-surface-container-low/60 border border-outline-variant/15 rounded-2xl p-xl md:p-[64px] text-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-[-50%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(var(--color-primary-container),0.06) 0%, transparent 70%)' }} />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary-container/10 border border-outline-variant/20 flex items-center justify-center mx-auto mb-lg">
              <span className="material-symbols-outlined text-[24px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">Start Managing Contacts Smarter</h2>
            <p className="text-sm text-on-surface-variant mb-xl max-w-md mx-auto">Join professionals who use PhoneBook to organize, search, and analyze their contact networks with enterprise precision.</p>
            <div className="flex flex-col sm:flex-row gap-md justify-center">
              <Link
                to="/register"
                className="h-12 px-xl bg-primary-container text-on-primary-container rounded-full font-label-lg text-label-lg transition-all duration-300 flex items-center justify-center gap-sm shadow-[0_0_20px_rgba(var(--color-primary-container),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary-container),0.5)] hover:scale-105 active:scale-95 font-bold"
              >
                Create Free Account
                <span className="material-symbols-outlined text-[18px]">person_add</span>
              </Link>
              <Link
                to="/login"
                className="h-12 px-xl border border-outline/25 hover:bg-surface-container-high/50 text-on-surface rounded-full font-label-lg text-label-lg transition-all duration-300 flex items-center justify-center gap-sm hover:scale-105 active:scale-95 font-bold"
              >
                Sign In
                <span className="material-symbols-outlined text-[18px]">login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

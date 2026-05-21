import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-xl px-md">
      <div className="bg-surface-container-low/60 border border-outline/10 rounded-xl p-lg md:p-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md">
        
        {/* Header */}
        <div className="border-b border-outline/10 pb-lg mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">Terms of Service</h1>
          <p className="text-xs text-on-surface-variant">Last Updated: May 21, 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-xl text-on-surface-variant font-body-md text-sm leading-relaxed">
          
          <section className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">1. Acceptance of Terms</h2>
            <p>
              By signing up for an account, accessing, or using the PhoneBook directory intelligence platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use our services.
            </p>
          </section>

          <section className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">2. User Account and Node Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and are fully responsible for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or security breach.
            </p>
          </section>

          <section className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">3. Acceptable Use and Directory Content</h2>
            <p>
              You maintain full ownership of all directory entries, companies, and contact information you upload to the system. You agree not to use PhoneBook to store spam contact targets, execute malicious API calls, or breach legal terms associated with regional telephone or direct marketing acts.
            </p>
          </section>

          <section className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">4. Service Uptime and Limits</h2>
            <p>
              We provide the services on an "as is" and "as available" basis. While we strive to maintain our active search nodes at 99.97% uptime, PhoneBook does not warrant that the search index operations will be entirely error-free, uninterrupted, or perfectly synchronized under high load spikes.
            </p>
          </section>

          <section className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">5. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the platform at any time, without prior notice, if we identify active breaches of these terms or patterns indicating automated scrapers or server abuse.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

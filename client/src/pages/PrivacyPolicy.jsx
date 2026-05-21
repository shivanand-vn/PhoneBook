import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-xl px-md">
      <div className="bg-surface-container-low/60 border border-outline/10 rounded-xl p-lg md:p-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md">
        
        {/* Header */}
        <div className="border-b border-outline/10 pb-lg mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">Privacy Policy</h1>
          <p className="text-xs text-on-surface-variant">Last Updated: May 21, 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-xl text-on-surface-variant font-body-md text-sm leading-relaxed">
          
          <section className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">1. Overview</h2>
            <p>
              At PhoneBook, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your directory data and personal information when you access and use our directory intelligence platform.
            </p>
          </section>

          <section className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">2. Information We Collect</h2>
            <p>
              We collect information you directly provide to us, including:
            </p>
            <ul className="list-disc pl-lg space-y-sm">
              <li><strong>Account Credentials:</strong> Name, email address, password, and profile image coordinates.</li>
              <li><strong>Directory Data:</strong> Contact details, tags, names, company names, email addresses, and phone numbers that you save to your isolated directory space.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with our fuzzy search engine and analytics dashboard.</li>
            </ul>
          </section>

          <section className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">3. Absolute Data Isolation</h2>
            <p>
              Unlike other platforms, PhoneBook is built with an enterprise-level isolated database architecture. Your contacts remain strictly private to your own account. We do not index, share, trade, or distribute your directory data to third parties, nor can other users access your nodes.
            </p>
          </section>

          <section className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">4. Storage and Security</h2>
            <p>
              Your passwords are encrypted using state-of-the-art bcrypt hashing, and API communication is strictly validated using signed JSON Web Tokens (JWT). All media files are stored securely using Cloudinary integration.
            </p>
          </section>

          <section className="space-y-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">5. Contact Information</h2>
            <p>
              If you have any questions or feedback about this policy, please contact our privacy compliance team at <span className="text-primary font-bold">privacy@phonebook.com</span>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../context/AuthContext';
import logoImg from '../assets/logo.jpeg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessage(data.message || 'Check your inbox for a password reset link.');
      } else {
        setError(data.message || 'Something went wrong. Please check your email and try again.');
      }
    } catch (err) {
      setError('Connection failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md text-body-md min-h-screen flex items-center justify-center relative overflow-hidden w-full selection:bg-primary-container selection:text-on-primary-container">
      {/* Ambient glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(163, 206, 212, 0.12) 0%, rgba(0, 22, 26, 0) 70%)' }}></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(184, 227, 233, 0.08) 0%, rgba(0, 22, 26, 0) 70%)' }}></div>

      {/* Main Container */}
      <main className="w-full max-w-[440px] px-md relative z-10">
        {/* Forgot Password Card */}
        <div className="bg-surface-container-low/60 border border-primary/20 rounded-xl p-lg md:p-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-xl">
            <div className="flex justify-center items-center gap-sm mb-lg">
              <img
                src={logoImg}
                alt="PhoneBook Logo"
                className="w-10 h-10 rounded-lg object-cover border border-primary/20 shadow-md"
              />
              <h1 className="font-headline-md text-headline-md text-primary">PhoneBook</h1>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Reset Password</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Enter your email and we'll send you a password reset link</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-lg">
            {error && (
              <div className="bg-error-container/20 border border-error/50 text-error p-sm rounded text-sm text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-primary-container/10 border border-primary/30 text-primary-container p-sm rounded text-sm text-center">
                {message}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-sm" htmlFor="email">Email address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-md text-on-surface-variant/70">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </span>
                <input
                  className="w-full h-[48px] pl-[44px] pr-md bg-surface-container border border-primary/20 rounded-lg font-body-md text-body-md text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-0 transition-colors"
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!!message}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full btn-premium-primary mt-lg"
              type="submit"
              disabled={isSubmitting || !!message}
            >
              {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
              {!isSubmitting && <span className="material-symbols-outlined text-[18px]">send</span>}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-lg">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Back to{' '}
            <Link className="text-primary-fixed-dim hover:text-primary transition-colors font-medium" to="/login">Sign In</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;

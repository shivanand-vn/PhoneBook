import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api';
import logoImg from '../assets/logo.jpeg';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setLocalError(data.message || 'Token is invalid or has expired.');
      }
    } catch (err) {
      setLocalError('Failed to reset password. Please try again.');
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
        {/* Reset Password Card */}
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
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">New Password</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Set your new password below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-lg">
            {localError && (
              <div className="bg-error-container/20 border border-error/50 text-error p-sm rounded text-sm text-center">
                {localError}
              </div>
            )}
            {success && (
              <div className="bg-primary-container/10 border border-primary/30 text-primary-container p-sm rounded text-sm text-center">
                Password reset successful! Redirecting to login in 3 seconds...
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-sm" htmlFor="password">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-md text-on-surface-variant/70">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <input
                  className="w-full h-[48px] pl-[44px] pr-md bg-surface-container border border-primary/20 rounded-lg font-body-md text-body-md text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-0 transition-colors"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={success}
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-sm" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-md text-on-surface-variant/70">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </span>
                <input
                  className="w-full h-[48px] pl-[44px] pr-md bg-surface-container border border-primary/20 rounded-lg font-body-md text-body-md text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-0 transition-colors"
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={success}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full btn-premium-primary mt-lg"
              type="submit"
              disabled={isSubmitting || success}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
              {!isSubmitting && <span className="material-symbols-outlined text-[18px]">verified</span>}
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

export default ResetPassword;

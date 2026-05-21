import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    const result = await register(formData);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setLocalError(result.message || 'Registration failed. Try a different email.');
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md text-body-md min-h-screen flex items-center justify-center relative overflow-hidden w-full py-lg selection:bg-primary-container selection:text-on-primary-container">
      {/* Ambient glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(163, 206, 212, 0.12) 0%, rgba(0, 22, 26, 0) 70%)' }}></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(184, 227, 233, 0.08) 0%, rgba(0, 22, 26, 0) 70%)' }}></div>

      {/* Main Container */}
      <main className="w-full max-w-[440px] px-md relative z-10">
        {/* Register Card */}
        <div className="bg-surface-container-low/60 border border-primary/20 rounded-xl p-lg md:p-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-lg">
            <div className="flex justify-center items-center gap-sm mb-md">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined font-semibold" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <h1 className="font-headline-md text-headline-md text-primary">Phonebook AI</h1>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Sign Up</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-md">
            {localError && (
              <div className="bg-error-container/20 border border-error/50 text-error p-sm rounded text-sm text-center">
                {localError}
              </div>
            )}

            {/* Name Input */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="name">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-md text-on-surface-variant/70">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
                <input
                  className="w-full h-[48px] pl-[44px] pr-md bg-surface-container border border-primary/20 rounded-lg font-body-md text-body-md text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-0 transition-colors"
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">Email address</label>
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
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="password">Password</label>
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
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full h-[48px] bg-primary-container hover:bg-primary-container/90 text-on-primary-container rounded-lg font-label-lg text-label-lg transition-colors flex items-center justify-center gap-sm mt-lg disabled:opacity-50 shadow-[0_0_12px_rgba(184,227,233,0.15)]"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
              {!isSubmitting && <span className="material-symbols-outlined text-[18px]">person_add</span>}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-lg">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Already have an account?{' '}
            <Link className="text-primary-fixed-dim hover:text-primary transition-colors font-medium" to="/login">Sign In</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;

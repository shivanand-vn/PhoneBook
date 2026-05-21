import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setLocalError(result.message || 'Invalid email or password');
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md text-body-md min-h-screen flex items-center justify-center relative overflow-hidden w-full selection:bg-primary-container selection:text-on-primary-container">
      {/* Ambient glows */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(163, 206, 212, 0.12) 0%, rgba(0, 22, 26, 0) 70%)' }}></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(184, 227, 233, 0.08) 0%, rgba(0, 22, 26, 0) 70%)' }}></div>

      {/* Main Container */}
      <main className="w-full max-w-[440px] px-md relative z-10">
        {/* Login Card */}
        <div className="bg-surface-container-low/60 border border-primary/20 rounded-xl p-lg md:p-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-xl">
            <div className="flex justify-center items-center gap-sm mb-lg">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined font-semibold" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <h1 className="font-headline-md text-headline-md text-primary">Phonebook AI</h1>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Welcome back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-lg">
            {localError && (
              <div className="bg-error-container/20 border border-error/50 text-error p-sm rounded text-sm text-center">
                {localError}
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
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-sm">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                <Link className="font-body-md text-body-md text-primary-fixed-dim hover:text-primary transition-colors text-sm" to="/forgot-password">Forgot password?</Link>
              </div>
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
              {isSubmitting ? 'Signing In...' : 'Sign In'}
              {!isSubmitting && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-xl mb-lg relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-sm bg-surface-container-low font-body-md text-body-md text-on-surface-variant">Or continue with</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-md">
            <button className="h-[48px] border border-primary/20 hover:bg-surface-variant/40 rounded-lg flex items-center justify-center gap-sm font-label-md text-label-md text-on-surface transition-colors" type="button">
              <span className="material-symbols-outlined text-[18px]">login</span>
              Google
            </button>
            <button className="h-[48px] border border-primary/20 hover:bg-surface-variant/40 rounded-lg flex items-center justify-center gap-sm font-label-md text-label-md text-on-surface transition-colors" type="button">
              <span className="material-symbols-outlined text-[18px]">code</span>
              GitHub
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-lg">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Don't have an account?{' '}
            <Link className="text-primary-fixed-dim hover:text-primary transition-colors font-medium" to="/register">Sign Up</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;

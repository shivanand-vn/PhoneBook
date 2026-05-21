import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Errors state for inline validation
  const [errors, setErrors] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatarPreview(user.avatar || '');
      setAvatarFile(null);
      setErrors({ name: '', email: '' });
    }
  }, [user]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const validateName = (val) => {
    if (!val.trim()) {
      return 'Name is required';
    }
    return '';
  };

  const validateEmail = (val) => {
    if (!val.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setErrors(prev => ({ ...prev, name: validateName(val) }));
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setErrors(prev => ({ ...prev, email: validateEmail(val) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setToast({ message: 'Avatar image file must be under 5MB', type: 'error' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setToast({ message: 'Only image files are allowed', type: 'error' });
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const hasChanges = user && (
    name !== user.name || 
    email !== user.email || 
    avatarFile !== null
  );

  const isFormInvalid = !!errors.name || !!errors.email || !name.trim() || !email.trim();
  const canSave = hasChanges && !isFormInvalid && !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('email', email.trim().toLowerCase());
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const res = await updateProfile(formData);
    setIsSubmitting(false);

    if (res.success) {
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      setAvatarFile(null);
    } else {
      setToast({ message: res.message || 'Failed to update profile', type: 'error' });
    }
  };

  const getInitials = (nameStr) => {
    if (!nameStr) return 'U';
    return nameStr.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-md max-w-2xl mx-auto relative">
      {/* Toast Alert Notification */}
      {toast && (
        <div className={`fixed top-[84px] right-md z-[100] px-md py-sm rounded-lg shadow-lg flex items-center gap-sm border transition-all ${
          toast.type === 'error' 
            ? 'bg-error-container/30 border-error/50 text-error' 
            : 'bg-surface-container-high/90 border-primary/40 text-primary'
        } backdrop-blur-md`}>
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">User Profile</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Update your account information and credentials.</p>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="bg-surface-container border border-primary/20 rounded-xl p-md md:p-lg space-y-md shadow-md relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
          
          {/* Avatar Upload Block */}
          <div className="flex flex-col sm:flex-row items-center gap-md pb-md border-b border-primary/10">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-surface-container flex items-center justify-center shadow-[0_0_16px_rgba(184,227,233,0.1)]">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center font-headline-xl text-headline-xl text-primary">
                    {getInitials(name)}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-container text-on-primary border border-primary/20 flex items-center justify-center cursor-pointer hover:opacity-90 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <div className="text-center sm:text-left space-y-xs">
              <h3 className="font-headline-md text-[18px] font-bold text-on-surface">{user.name}</h3>
              <p className="text-xs text-on-surface-variant">Click the camera icon to upload a new avatar profile image (Max 5MB).</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-md">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className={`w-full h-[40px] px-md bg-surface-container/60 border rounded-lg text-sm text-on-surface focus:outline-none focus:ring-0 transition-all placeholder:text-on-surface-variant/40 ${
                  errors.name ? 'border-error' : 'border-primary/20 focus:border-primary'
                }`}
                placeholder="Your Name"
              />
              {errors.name && (
                <p className="text-[11px] text-error mt-xs flex items-center gap-xs font-semibold">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full h-[40px] px-md bg-surface-container/60 border rounded-lg text-sm text-on-surface focus:outline-none focus:ring-0 transition-all placeholder:text-on-surface-variant/40 ${
                  errors.email ? 'border-error' : 'border-primary/20 focus:border-primary'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-[11px] text-error mt-xs flex items-center gap-xs font-semibold">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Read-Only Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md pt-sm border-t border-primary/10">
            <div>
              <span className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider">Account ID</span>
              <span className="block font-code-sm text-sm text-on-surface font-semibold mt-xs truncate select-text">{user.id || user._id}</span>
            </div>
            <div>
              <span className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider">Join Date</span>
              <span className="block font-body-sm text-sm text-on-surface font-semibold mt-xs">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'May 2026'}
              </span>
            </div>
          </div>

          <div className="pt-md border-t border-primary/10 flex items-center justify-between flex-wrap gap-md">
            <div>
              <h4 className="text-xs font-semibold text-primary mb-xs">Role & System Privileges</h4>
              <div className="flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-xs text-on-surface-variant font-medium">Standard Directory Operator</span>
              </div>
            </div>

            {/* Actions */}
            <button
              type="submit"
              disabled={!canSave}
              className={`h-[40px] px-lg rounded-full font-bold text-xs transition-all flex items-center gap-xs duration-200 ${
                canSave
                  ? 'bg-primary-container text-on-primary-container shadow-[0_0_16px_rgba(var(--color-primary-container),0.3)] hover:shadow-[0_0_24px_rgba(var(--color-primary-container),0.5)] hover:scale-105 active:scale-95'
                  : 'bg-surface-container-highest text-on-surface-variant/40 border border-outline/10 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Profile'}
              {!isSubmitting && <span className="material-symbols-outlined text-[16px]">save</span>}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-surface-container border border-primary/20 rounded-xl p-lg text-center animate-pulse">
          <p className="text-sm text-on-surface-variant">Loading user profile details...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';

const ContactModal = ({ isOpen, onClose, contact, onSaveSuccess }) => {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [tags, setTags] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize values if editing
  useEffect(() => {
    if (contact) {
      setName(contact.name || '');
      setPhone(contact.phone || '');
      setEmail(contact.email || '');
      setCompany(contact.company || '');
      setAddress(contact.address || '');
      setTags(contact.tags ? contact.tags.join(', ') : '');
      setFavorite(contact.favorite || false);
      setImagePreview(contact.profileImage || '');
      setImageFile(null);
    } else {
      // Clear values if creating new
      setName('');
      setPhone('');
      setEmail('');
      setCompany('');
      setAddress('');
      setTags('');
      setFavorite(false);
      setImagePreview('');
      setImageFile(null);
    }
    setError(null);
  }, [contact, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('company', company);
    formData.append('address', address);
    formData.append('tags', tags);
    formData.append('favorite', favorite);
    if (imageFile) {
      formData.append('profileImage', imageFile);
    }

    try {
      const url = contact ? `${API_URL}/contacts/${contact._id}` : `${API_URL}/contacts`;
      const method = contact ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save contact');
      }

      onSaveSuccess(data.contact, contact ? 'update' : 'create');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="w-full max-w-[500px] glass border border-primary/20 rounded-xl shadow-[0_16px_36px_rgba(0,0,0,0.6)] z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="h-[60px] px-lg border-b border-primary/10 flex items-center justify-between bg-surface-container-low/80">
          <h3 className="font-headline-sm text-sm font-semibold text-primary">
            {contact ? 'Edit Contact Profile' : 'Add New Contact'}
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-lg space-y-md timeline-scroll">
          {error && (
            <div className="bg-error-container/20 border border-error/50 text-error p-sm rounded text-sm text-center">
              {error}
            </div>
          )}

          {/* Profile Image Dropzone */}
          <div className="flex flex-col items-center gap-xs pb-sm">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-primary/20 bg-surface-container flex items-center justify-center shadow-[0_0_12px_rgba(184,227,233,0.1)]">
                {imagePreview ? (
                  <img src={imagePreview} alt="Contact Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[36px] text-on-surface-variant/30">person</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-container text-on-primary border border-primary/20 flex items-center justify-center cursor-pointer hover:opacity-90 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <span className="text-[11px] text-on-surface-variant">Profile Photo (Max 5MB)</span>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {/* Name */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Eleanor Pena"
                className="w-full h-[40px] px-md bg-surface-container/60 border border-primary/20 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="(208) 555-0112"
                className="w-full h-[40px] px-md bg-surface-container/60 border border-primary/20 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor.pena@example.com"
                className="w-full h-[40px] px-md bg-surface-container/60 border border-primary/20 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="w-full h-[40px] px-md bg-surface-container/60 border border-primary/20 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Work, Friend, Important"
                className="w-full h-[40px] px-md bg-surface-container/60 border border-primary/20 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Address */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider mb-xs">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="4513 Elm St, Springfield"
                className="w-full h-[40px] px-md bg-surface-container/60 border border-primary/20 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Favorite toggle */}
            <div className="col-span-1 sm:col-span-2 flex items-center gap-sm pt-sm">
              <input
                type="checkbox"
                id="favorite"
                checked={favorite}
                onChange={(e) => setFavorite(e.target.checked)}
                className="w-4 h-4 bg-surface-container border border-primary/20 rounded focus:ring-0 text-primary-container"
              />
              <label htmlFor="favorite" className="text-xs text-on-surface-variant select-none cursor-pointer flex items-center gap-xs">
                <span className={`material-symbols-outlined text-[16px] ${favorite ? 'text-secondary fill-current' : 'text-on-surface-variant'}`}>star</span>
                Mark as Favorite
              </label>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="h-[60px] px-lg border-t border-primary/10 bg-surface-container-low/80 flex items-center justify-end gap-md">
          <button
            type="button"
            onClick={onClose}
            className="px-md h-[36px] border border-outline/25 hover:bg-surface-container-high hover:border-outline/40 text-on-surface rounded-full text-xs font-semibold hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-md h-[36px] bg-primary-container text-on-primary-container rounded-full text-xs font-bold transition-all flex items-center gap-xs disabled:opacity-50 shadow-[0_0_16px_rgba(var(--color-primary-container),0.3)] hover:shadow-[0_0_24px_rgba(var(--color-primary-container),0.5)] hover:scale-105 active:scale-95 duration-200"
          >
            {isSubmitting ? 'Saving...' : 'Save Contact'}
            {!isSubmitting && <span className="material-symbols-outlined text-[16px]">save</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;

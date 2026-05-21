import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import ContactModal from '../components/ContactModal';

const ContactDetails = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Modal Edit Control
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Local-first notes
  const [notes, setNotes] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchContactDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setContact(data.contact);
        const savedNotes = localStorage.getItem(`contact_notes_${id}`) || '';
        setNotes(savedNotes);
      } else {
        setError(data.message || 'Contact not found');
      }
    } catch (err) {
      setError('Connection error occurred while retrieving contact');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactDetails();
  }, [id, token]);

  const handleFavoriteToggle = async () => {
    try {
      const response = await fetch(`${API_URL}/contacts/${id}/favorite`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setContact({ ...contact, favorite: data.favorite });
        showToast(data.message);
      }
    } catch (err) {
      showToast('Failed to toggle favorite', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        navigate('/contacts');
      } else {
        showToast('Failed to delete contact', 'error');
      }
    } catch (err) {
      showToast('Connection error during deletion', 'error');
    }
  };

  const handleNotesChange = (e) => {
    const value = e.target.value;
    setNotes(value);
    localStorage.setItem(`contact_notes_${id}`, value);
  };

  const handleSaveSuccess = (updatedContact) => {
    setContact(updatedContact);
    showToast('Contact updated successfully');
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined text-[36px] text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="text-center py-xl bg-surface-container-low border border-primary/25 rounded-xl max-w-md mx-auto mt-lg shadow-md">
        <span className="material-symbols-outlined text-[48px] text-error/30 mb-md">person_off</span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface">{error || 'Contact not found'}</h3>
        <Link to="/contacts" className="mt-sm text-xs font-semibold text-primary hover:text-primary-fixed transition-colors underline block">
          Return to contacts database
        </Link>
      </div>
    );
  }

  const addedDate = new Date(contact.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const updatedDate = new Date(contact.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-md relative selection:bg-primary-container selection:text-on-primary-container">
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

      {/* Breadcrumb Navigation */}
      <section className="flex items-center gap-xs text-[11px] font-label-md text-on-surface-variant mb-md">
        <Link to="/contacts" className="hover:text-primary transition-colors flex items-center gap-xs">
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          Contacts
        </Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">{contact.name}</span>
      </section>

      {/* Profile Sweden Style Header Banner */}
      <section className="bg-surface-container border border-primary/20 rounded-xl p-md md:p-lg relative overflow-hidden group shadow-md">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div className="flex flex-col md:flex-row items-center gap-md text-center md:text-left">
            {/* Profile Avatar */}
            {contact.profileImage ? (
              <img
                src={contact.profileImage}
                alt={contact.name}
                className="w-20 h-20 rounded-lg border border-primary/20 object-cover shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-headline-xl text-headline-xl text-primary flex-shrink-0">
                {getInitials(contact.name)}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-xs mb-xs">
                <h2 className="font-headline-lg text-headline-lg text-on-surface leading-none">{contact.name}</h2>
                <span className="flex items-center gap-xs px-xs py-[2px] bg-primary-container/10 border border-primary-container/20 text-primary-container rounded-full font-label-md text-[10px] leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span> Active
                </span>
              </div>
              <p className="font-code-sm text-code-sm text-on-surface-variant">{contact.company || 'Private Professional Network'}</p>
              <p className="font-label-md text-[11px] text-on-surface-variant/70 mt-[4px] flex items-center gap-xs justify-center md:justify-start">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {contact.address || 'Global / Timezone CET'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-xs w-full md:w-auto justify-center">
            <button
              onClick={handleFavoriteToggle}
              className="h-[36px] px-sm bg-surface-container-low border border-primary/20 hover:border-primary transition-all text-on-surface rounded-lg flex items-center justify-center"
              title={contact.favorite ? 'Unfavorite' : 'Favorite'}
            >
              <span className={`material-symbols-outlined text-[20px] ${contact.favorite ? 'text-secondary filled' : 'opacity-40'}`}>
                star
              </span>
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="h-[36px] px-md bg-primary-container text-on-primary-container rounded-lg font-label-lg text-xs hover:opacity-95 transition-all flex items-center gap-xs shadow-[0_0_12px_rgba(184,227,233,0.15)]"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span> Edit Profile
            </button>
            <button
              onClick={handleDelete}
              className="h-[36px] px-sm border border-error/30 hover:bg-error-container/10 text-error rounded-lg transition-colors flex items-center justify-center"
              title="Delete Contact"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Bento details grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        {/* Contact details list (Spans 8) */}
        <div className="lg:col-span-8 space-y-md">
          {/* Bento grid section for fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {/* Phone Card */}
            <div className="bg-surface-container border border-primary/20 rounded-lg p-md hover:border-primary/40 transition-colors shadow-sm flex justify-between items-center group">
              <div>
                <span className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Phone</span>
                <span className="block font-code-sm text-sm text-on-surface font-semibold mt-xs">{contact.phone}</span>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="w-8 h-8 rounded-full bg-primary-container/10 text-primary border border-primary/20 flex items-center justify-center hover:bg-primary-container/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-surface-container border border-primary/20 rounded-lg p-md hover:border-primary/40 transition-colors shadow-sm flex justify-between items-center group">
              <div>
                <span className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Email</span>
                <span className="block font-code-sm text-sm text-on-surface font-semibold mt-xs truncate max-w-[200px] sm:max-w-none">{contact.email || '—'}</span>
              </div>
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="w-8 h-8 rounded-full bg-secondary/15 text-secondary border border-secondary/20 flex items-center justify-center hover:bg-secondary/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                </a>
              )}
            </div>

            {/* Timezone & Country Card */}
            <div className="bg-surface-container border border-primary/20 rounded-lg p-md shadow-sm">
              <span className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Location / Timezone</span>
              <span className="block font-body-sm text-body-sm text-on-surface font-semibold mt-xs">{contact.address || 'CET (Central European Time)'}</span>
            </div>

            {/* Physical Address details */}
            <div className="bg-surface-container border border-primary/20 rounded-lg p-md hover:border-primary/40 transition-colors shadow-sm flex justify-between items-center group">
              <div>
                <span className="block font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">Street Address</span>
                <span className="block font-body-sm text-body-sm text-on-surface font-semibold mt-xs">{contact.address || '—'}</span>
              </div>
              {contact.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-inverse-primary/20 text-inverse-primary border border-inverse-primary/20 flex items-center justify-center hover:bg-inverse-primary/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                </a>
              )}
            </div>
          </div>

          {/* CRM Notepad Local storage */}
          <div className="bg-surface-container border border-primary/20 rounded-lg p-md shadow-sm space-y-sm">
            <div className="flex items-center gap-xs mb-xs">
              <span className="material-symbols-outlined text-primary-container text-[20px]">sticky_note_2</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">CRM Notepad</h3>
            </div>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Type quick offline follow-up notes here... notes will persist instantly on local storage."
              className="w-full min-h-[140px] p-sm bg-surface-container-low border border-primary/10 rounded-lg text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary-container focus:ring-0 transition-colors timeline-scroll resize-none"
            />
          </div>
        </div>

        {/* Side panel categorization & timeline (Spans 4) */}
        <div className="lg:col-span-4 space-y-md">
          {/* Categorization Card */}
          <div className="bg-surface-container border border-primary/20 rounded-lg p-md shadow-sm">
            <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-md">Categorization Tags</h3>
            <div className="flex flex-wrap gap-xs">
              {contact.tags && contact.tags.length > 0 ? (
                contact.tags.map(t => (
                  <span
                    key={t}
                    className="text-[11px] font-medium bg-primary-container/10 border border-primary/20 text-primary px-sm py-[4px] rounded-full"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs text-on-surface-variant/45">No category tags set</span>
              )}
            </div>
          </div>

          {/* Activity timeline Card */}
          <div className="bg-surface-container border border-primary/20 rounded-lg p-md shadow-sm">
            <h3 className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider mb-md">Activity Log</h3>
            <div className="relative pl-md border-l border-primary/10 space-y-md py-xs">
              <div className="relative">
                <span className="absolute -left-[23px] top-[2px] w-4 h-4 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[10px]">edit</span>
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-on-surface">Details Updated</h4>
                  <span className="text-[10px] text-on-surface-variant font-label-md">{updatedDate}</span>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-[23px] top-[2px] w-4 h-4 rounded-full bg-primary-container/20 border border-primary-container flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-[10px]">person_add</span>
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-on-surface">Registered in Database</h4>
                  <span className="text-[10px] text-on-surface-variant font-label-md">{addedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit modal */}
      <ContactModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        contact={contact}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default ContactDetails;

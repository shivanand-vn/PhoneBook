import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import ContactModal from '../components/ContactModal';

const Favorites = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/contacts?favorite=true&limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setContacts(data.contacts);
      }
    } catch (err) {
      showToast('Failed to fetch favorite contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  const handleFavoriteToggle = async (e, contactId) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/contacts/${contactId}/favorite`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast('Updated favorites successfully');
        setContacts(contacts.map(c => c._id === contactId ? { ...c, favorite: data.favorite } : c));
      }
    } catch (err) {
      showToast('Failed to toggle favorite status', 'error');
    }
  };

  const handleOpenEditModal = (e, contact) => {
    e.stopPropagation();
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-md relative">
      {toast && (
        <div className="fixed top-[84px] right-md z-[100] px-md py-sm rounded-lg shadow-lg flex items-center gap-sm border bg-surface-container-high/90 border-primary/40 text-primary backdrop-blur-md">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Starred Connections</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Your bookmarked and high-priority contacts.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-container-low border border-primary/10 rounded-lg p-sm h-[130px] animate-pulse" />
          ))}
        </div>
      ) : contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {contacts.map(contact => (
            <div
              key={contact._id}
              onClick={() => navigate(`/contacts/${contact._id}`)}
              className="bg-surface-container-highest/30 border border-primary/20 rounded-lg p-sm relative group hover:bg-surface-container-highest/50 transition-all duration-200 flex flex-col justify-between cursor-pointer hover:border-primary/40 shadow-[0_0_12px_rgba(0,0,0,0.15)] min-h-[140px]"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-container rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <button
                onClick={(e) => handleFavoriteToggle(e, contact._id)}
                className="absolute right-sm top-sm text-secondary hover:text-primary transition-colors"
              >
                <span className={`material-symbols-outlined text-[20px] ${contact.favorite ? 'filled' : ''}`}>star</span>
              </button>

              <div className="flex items-start gap-sm">
                {contact.profileImage ? (
                  <img src={contact.profileImage} alt={contact.name} className="w-10 h-10 rounded bg-primary/10 border border-primary/20 object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center font-headline-sm text-headline-sm text-primary flex-shrink-0">
                    {getInitials(contact.name)}
                  </div>
                )}
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface font-semibold group-hover:text-primary transition-colors">{contact.name}</h4>
                  <p className="font-code-sm text-code-sm text-primary truncate mt-[2px] font-medium">{contact.company || 'Private Address'}</p>
                  {contact.email && (
                    <p className="text-[11px] text-on-surface-variant/80 truncate mt-[2px]">{contact.email}</p>
                  )}
                  <p className="text-[11px] text-on-surface-variant/70 mt-[4px] font-mono">{contact.phone}</p>
                </div>
              </div>

              <div className="mt-sm pt-xs border-t border-primary/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-xs">
                  {contact.tags && contact.tags.slice(0, 2).map(t => (
                    <span key={t} className="px-xs py-[2px] bg-primary/15 text-primary rounded font-label-md text-[10px] border border-primary/30 leading-none font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => handleOpenEditModal(e, contact)}
                  className="w-7 h-7 rounded hover:bg-surface-variant/40 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container border border-primary/20 rounded-xl p-lg text-center shadow-md">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20 mb-md">star_rate</span>
          <p className="text-sm text-on-surface-variant">No starred contacts yet. Toggle the star icon on any contact card to add it to your favorites list.</p>
        </div>
      )}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        onSaveSuccess={fetchFavorites}
      />
    </div>
  );
};

export default Favorites;

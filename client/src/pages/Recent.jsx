import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';

const Recent = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/contacts?sortBy=recently_added&limit=15`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setContacts(data.contacts);
      }
    } catch (err) {
      console.error('Failed to fetch recent contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, [token]);

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-md">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Recent Directory Updates</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Review latest additions and revisions made to your connections.</p>
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
                  <p className="font-code-sm text-code-sm text-on-surface-variant truncate mt-[2px]">{contact.company || 'Private Address'}</p>
                  <p className="text-[10px] text-primary mt-[4px] font-mono">Added: {new Date(contact.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-sm pt-xs border-t border-primary/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-xs">
                  {contact.tags && contact.tags.slice(0, 2).map(t => (
                    <span key={t} className="px-xs py-[2px] bg-inverse-primary/20 text-tertiary-fixed-dim rounded font-label-md text-[10px] border border-inverse-primary/30 leading-none">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40 group-hover:text-primary transition-colors">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container border border-primary/20 rounded-xl p-lg text-center shadow-md">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20 mb-md">history</span>
          <p className="text-sm text-on-surface-variant">No contacts added yet.</p>
        </div>
      )}
    </div>
  );
};

export default Recent;

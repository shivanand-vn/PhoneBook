import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';

const Tags = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tagGroups, setTagGroups] = useState({});

  useEffect(() => {
    const fetchAndGroup = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/contacts?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok && data.success) {
          const groups = {};
          data.contacts.forEach(c => {
            if (c.tags && c.tags.length > 0) {
              c.tags.forEach(t => {
                const normalized = t.trim();
                if (!groups[normalized]) {
                  groups[normalized] = [];
                }
                groups[normalized].push(c);
              });
            } else {
              const untagged = 'Uncategorized';
              if (!groups[untagged]) {
                groups[untagged] = [];
              }
              groups[untagged].push(c);
            }
          });
          setTagGroups(groups);
        }
      } catch (err) {
        console.error('Failed to load tags:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndGroup();
  }, [token]);

  return (
    <div className="space-y-md">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Active Tags & Segments</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Classify and filter your contact network by labels and departments.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-container-low border border-primary/10 rounded-lg p-md h-[130px] animate-pulse" />
          ))}
        </div>
      ) : Object.keys(tagGroups).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {Object.entries(tagGroups).map(([tagName, members]) => (
            <div
              key={tagName}
              className="bg-surface-container border border-primary/20 rounded-xl p-md flex flex-col justify-between hover:border-primary/45 transition-colors shadow-sm relative overflow-hidden group min-h-[140px]"
            >
              <div>
                <div className="flex items-center justify-between mb-sm">
                  <h3 className="font-headline-sm text-md font-semibold text-on-surface">#{tagName}</h3>
                  <span className="material-symbols-outlined text-primary text-[20px]">label</span>
                </div>
                <span className="text-[11px] font-medium bg-primary-container/10 border border-primary/20 text-primary px-sm py-[2px] rounded-full">
                  {members.length} {members.length === 1 ? 'Contact' : 'Contacts'}
                </span>
              </div>

              <div className="mt-md flex items-center justify-between">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {members.slice(0, 4).map(m => (
                    <img
                      key={m._id}
                      src={m.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&h=60&q=80'}
                      alt={m.name}
                      onClick={() => navigate(`/contacts/${m._id}`)}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-background object-cover cursor-pointer hover:scale-110 transition-transform"
                      title={m.name}
                    />
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/contacts?tag=${encodeURIComponent(tagName)}`)}
                  className="text-xs text-primary-fixed-dim hover:text-primary transition-all flex items-center gap-xs font-semibold"
                >
                  Filter Group <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container border border-primary/20 rounded-xl p-lg text-center shadow-md">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20 mb-md">label</span>
          <p className="text-sm text-on-surface-variant">No classification tags active.</p>
        </div>
      )}
    </div>
  );
};

export default Tags;

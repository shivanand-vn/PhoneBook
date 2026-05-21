import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';

const Companies = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companyGroups, setCompanyGroups] = useState({});

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
            const comp = c.company ? c.company.trim() : 'Private Network';
            if (!groups[comp]) {
              groups[comp] = [];
            }
            groups[comp].push(c);
          });
          setCompanyGroups(groups);
        }
      } catch (err) {
        console.error('Failed to load companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndGroup();
  }, [token]);

  return (
    <div className="space-y-md">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Organizations & Companies</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Roster of accounts and professional organizations mapped inside your database.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-container-low border border-primary/10 rounded-lg p-md h-[150px] animate-pulse" />
          ))}
        </div>
      ) : Object.keys(companyGroups).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {Object.entries(companyGroups).map(([companyName, members]) => (
            <div
              key={companyName}
              className="bg-surface-container border border-primary/20 rounded-xl p-md flex flex-col justify-between hover:border-primary/45 transition-colors shadow-sm relative overflow-hidden group min-h-[150px]"
            >
              <div>
                <div className="flex items-start justify-between mb-sm">
                  <h3 className="font-headline-sm text-md font-semibold text-on-surface truncate pr-md w-full">{companyName}</h3>
                  <span className="material-symbols-outlined text-primary text-[20px]">domain</span>
                </div>
                <span className="text-[11px] font-medium bg-primary-container/10 border border-primary/20 text-primary px-sm py-[2px] rounded-full">
                  {members.length} {members.length === 1 ? 'Contact' : 'Contacts'}
                </span>
              </div>

              {/* Quick list of first 3 members avatars */}
              <div className="mt-md flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                  {members.slice(0, 4).map((member, i) => (
                    <img
                      key={member._id}
                      src={member.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&h=60&q=80'}
                      alt={member.name}
                      onClick={() => navigate(`/contacts/${member._id}`)}
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-background object-cover cursor-pointer hover:scale-110 transition-transform"
                      title={member.name}
                    />
                  ))}
                  {members.length > 4 && (
                    <span className="flex items-center justify-center h-7 w-7 rounded-full bg-surface-container-high ring-2 ring-background font-label-md text-[10px] text-on-surface-variant font-semibold">
                      +{members.length - 4}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => navigate(`/contacts?company=${encodeURIComponent(companyName)}`)}
                  className="text-xs text-primary-fixed-dim hover:text-primary transition-all flex items-center gap-xs font-semibold"
                >
                  View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container border border-primary/20 rounded-xl p-lg text-center shadow-md">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20 mb-md">domain</span>
          <p className="text-sm text-on-surface-variant">No company listings mapped yet.</p>
        </div>
      )}
    </div>
  );
};

export default Companies;

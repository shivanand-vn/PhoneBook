import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-md max-w-2xl mx-auto">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">User Profile</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Manage your account information and credentials.</p>
      </div>

      {user ? (
        <div className="bg-surface-container border border-primary/20 rounded-xl p-md md:p-lg space-y-md shadow-md relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-md pb-md border-b border-primary/10">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full border border-primary/20 object-cover shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-headline-xl text-headline-xl text-primary">
                {getInitials(user.name)}
              </div>
            )}
            <div className="text-center sm:text-left">
              <h3 className="font-headline-md text-headline-md text-on-surface">{user.name}</h3>
              <p className="font-code-sm text-code-sm text-on-surface-variant">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md pt-sm">
            <div>
              <span className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider">Account ID</span>
              <span className="block font-code-sm text-sm text-on-surface font-semibold mt-xs truncate">{user.id || user._id}</span>
            </div>
            <div>
              <span className="block text-[11px] font-label-md text-on-surface-variant uppercase tracking-wider">Join Date</span>
              <span className="block font-body-sm text-sm text-on-surface font-semibold mt-xs">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'May 2026'}
              </span>
            </div>
          </div>

          <div className="pt-md border-t border-primary/10">
            <h4 className="text-xs font-semibold text-primary mb-xs">Role & System Privileges</h4>
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-xs text-on-surface-variant font-medium">Standard Directory Operator</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container border border-primary/20 rounded-xl p-lg text-center animate-pulse">
          <p className="text-sm text-on-surface-variant">Loading user profile details...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;

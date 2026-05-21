import React, { useState } from 'react';

const Settings = () => {
  const [offlineSync, setOfflineSync] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <div className="space-y-md max-w-2xl mx-auto">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">System Settings</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Adjust visual settings and offline storage sync tolerances.</p>
      </div>

      <div className="bg-surface-container border border-primary/20 rounded-xl p-md md:p-lg space-y-md shadow-md">
        {/* Toggle 1: Offline CRM Notes Sync */}
        <div className="flex items-center justify-between pb-md border-b border-primary/10">
          <div>
            <h4 className="font-headline-sm text-sm font-semibold text-on-surface">Offline CRM Sync</h4>
            <p className="text-xs text-on-surface-variant">Automatically persist notepad updates to local storage cache.</p>
          </div>
          <button
            onClick={() => setOfflineSync(!offlineSync)}
            className={`w-12 h-6 rounded-full transition-colors flex items-center p-xs ${
              offlineSync ? 'bg-primary-container justify-end' : 'bg-surface-container-high border border-primary/10 justify-start'
            }`}
          >
            <span className={`w-4 h-4 rounded-full ${offlineSync ? 'bg-on-primary-container' : 'bg-on-surface-variant/40'}`} />
          </button>
        </div>

        {/* Toggle 2: Notifications */}
        <div className="flex items-center justify-between pb-md border-b border-primary/10">
          <div>
            <h4 className="font-headline-sm text-sm font-semibold text-on-surface">System Alerts</h4>
            <p className="text-xs text-on-surface-variant">Pop up status toast alerts on database additions or favorite changes.</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors flex items-center p-xs ${
              notifications ? 'bg-primary-container justify-end' : 'bg-surface-container-high border border-primary/10 justify-start'
            }`}
          >
            <span className={`w-4 h-4 rounded-full ${notifications ? 'bg-on-primary-container' : 'bg-on-surface-variant/40'}`} />
          </button>
        </div>

        {/* Toggle 3: Ambient Glows */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-headline-sm text-sm font-semibold text-on-surface">Ultra Contrast</h4>
            <p className="text-xs text-on-surface-variant">Turn off blurred background circles to optimize mobile rendering speed.</p>
          </div>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-12 h-6 rounded-full transition-colors flex items-center p-xs ${
              highContrast ? 'bg-primary-container justify-end' : 'bg-surface-container-high border border-primary/10 justify-start'
            }`}
          >
            <span className={`w-4 h-4 rounded-full ${highContrast ? 'bg-on-primary-container' : 'bg-on-surface-variant/40'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

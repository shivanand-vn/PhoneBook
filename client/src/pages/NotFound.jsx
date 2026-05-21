import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-md bg-surface-container-low/40 border border-primary/20 rounded-xl max-w-md mx-auto shadow-md">
      <span className="material-symbols-outlined text-[64px] text-primary animate-pulse mb-md">explore_off</span>
      <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">404 - Area Unmapped</h2>
      <p className="text-sm text-on-surface-variant mb-lg">The destination address does not exist or has been relocated within the directory database.</p>
      <Link
        to="/"
        className="px-md py-sm bg-primary-container text-on-primary-container rounded-lg font-label-lg text-xs hover:opacity-95 transition-all shadow-[0_0_12px_rgba(184,227,233,0.15)] flex items-center gap-xs"
      >
        <span className="material-symbols-outlined text-[16px]">dashboard</span> Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;

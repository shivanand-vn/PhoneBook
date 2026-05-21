import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm animate-fade-in" onClick={onCancel} />

      {/* Modal Dialog */}
      <div className="w-full max-w-[400px] glass border border-error/20 rounded-xl shadow-[0_16px_36px_rgba(0,0,0,0.6)] z-10 overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="h-[56px] px-lg border-b border-outline/10 flex items-center justify-between bg-surface-container-low/80">
          <h3 className="font-headline-sm text-sm font-semibold text-error flex items-center gap-xs">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <span>{title || 'Confirm Action'}</span>
          </h3>
          <button onClick={onCancel} className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-lg space-y-md">
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            {message || 'Are you sure you want to proceed?'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-lg pb-lg pt-xs flex justify-end gap-sm">
          <button
            onClick={onCancel}
            className="h-10 px-md border border-outline/25 hover:bg-surface-container-high/50 text-on-surface rounded-full font-label-md text-xs transition-all hover:scale-105 active:scale-95 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-10 px-md bg-error hover:bg-error/90 text-on-error rounded-full font-label-md text-xs transition-all shadow-[0_0_16px_rgba(var(--color-error),0.2)] hover:scale-105 active:scale-95 font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

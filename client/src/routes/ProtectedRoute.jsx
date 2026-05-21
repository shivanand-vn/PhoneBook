import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

const ProtectedRoute = ({ children, title }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-md">
        <div className="w-12 h-12 rounded-lg bg-surface-container border border-primary/20 flex items-center justify-center animate-pulse">
          <span className="material-symbols-outlined text-primary text-[32px] animate-spin">auto_awesome</span>
        </div>
        <span className="text-sm font-label-md text-on-surface-variant">Connecting to Directory...</span>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout title={title}>{children}</DashboardLayout>;
};

export default ProtectedRoute;

import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center p-md relative overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      
      {children || <Outlet />}
    </div>
  );
};

export default AuthLayout;

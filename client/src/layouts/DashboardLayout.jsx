import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Content wrapper */}
      <main className="lg:pl-[260px] pt-[72px] flex-1 flex flex-col transition-all">
        <div className="p-md lg:p-lg max-w-7xl mx-auto w-full flex-1">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

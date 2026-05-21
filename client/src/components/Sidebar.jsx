import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.jpeg';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: 'dashboard'
    },
    {
      path: '/contacts',
      name: 'Contacts',
      icon: 'person'
    },
    {
      path: '/favorites',
      name: 'Favorites',
      icon: 'star'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-surface-container-low/60 backdrop-blur-md border-r border-outline/10 shadow-xl z-50 flex flex-col justify-between p-base gap-xs transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="px-md py-sm mb-md flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-sm" onClick={() => setIsOpen(false)}>
              <img
                src={logoImg}
                alt="PhoneBook"
                className="h-9 w-9 rounded-lg object-cover border border-primary/20 shadow-sm"
              />
              <div>
                <h1 className="font-headline-sm text-[16px] font-bold text-primary tracking-wide leading-none">PhoneBook</h1>
                <p className="font-label-md text-[10px] text-on-surface-variant mt-[2px] leading-none">Enterprise CRM</p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-primary hover:text-primary-fixed p-xs rounded-full hover:bg-surface-container-high/50 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-xs">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-sm px-md py-sm rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_2px_12px_rgba(var(--color-primary-container),0.25)]'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 hover:translate-x-1'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`}>
                    {item.icon}
                  </span>
                  <span className="font-label-lg text-label-lg">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-on-primary-container/60" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-md py-md border-t border-outline/10 bg-surface-container-lowest/30 text-center font-label-md text-[10px] text-on-surface-variant/40">
          <span>Enterprise Secure Directory</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

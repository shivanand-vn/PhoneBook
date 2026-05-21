import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/',
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
    },
    {
      path: '/recent',
      name: 'Recent',
      icon: 'history'
    },
    {
      path: '/companies',
      name: 'Companies',
      icon: 'domain'
    },
    {
      path: '/tags',
      name: 'Tags',
      icon: 'label'
    },
    {
      path: '/profile',
      name: 'Profile',
      icon: 'account_circle'
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: 'settings'
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
        className={`fixed top-0 bottom-0 left-0 w-64 bg-surface-container-low/60 dark:bg-surface-container-lowest/60 backdrop-blur-md border-r border-primary/10 shadow-xl z-50 flex flex-col justify-between p-base gap-xs transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="px-md py-sm mb-md flex items-center justify-between">
            <Link to="/" className="flex items-center gap-sm" onClick={() => setIsOpen(false)}>
              <div className="h-8 w-8 rounded bg-primary-container flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined font-bold text-[20px]">book</span>
              </div>
              <div>
                <h1 className="font-headline-sm text-[16px] font-bold text-primary dark:text-primary-fixed-dim tracking-wide leading-none">Phonebook AI</h1>
                <p className="font-label-md text-[10px] text-on-surface-variant mt-[2px] leading-none">Enterprise CRM</p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-primary hover:text-primary-fixed p-xs"
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
                  className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all duration-200 hover:translate-x-1 ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/30'
                  }`}
                >
                  <span className="material-symbols-outlined">
                    {item.icon}
                  </span>
                  <span className="font-label-lg text-label-lg">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="px-md py-md border-t border-primary/10 bg-surface-container-lowest/30">
          <div className="flex items-center gap-sm mb-md">
            <img
              src={user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVJHlwCB7ZDhR_VktYTNopS99XH9ZbC7PIIUOgPfCOzgzHTSKxkKbrWJqdGeOhJ7TLKIL_iQl5k1dq7BZ_KrKtoxXlHw0brH96tocgDyCuQHU0HSKTlG4wHDnBZ_Fey36Od8RqBMTLX0oiaI6yA2QqfOXpcNft_TFb8ErqkKLSQ7PdN2Jgc2uhlsufWE2ko3vjuq8JiRWY3F-KISMDs-MRcBDKuFCPT5V_kJZJ0q-2IEjSgSKjhaZGQHJK_Er8E67l5w4YTIHsryk'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full border border-primary/20 object-cover"
            />
            <div className="overflow-hidden">
              <h4 className="font-label-lg text-xs text-on-surface font-semibold truncate leading-none">{user?.name}</h4>
              <p className="font-label-md text-[10px] text-on-surface-variant truncate mt-[2px] leading-none">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-sm px-sm py-xs bg-transparent border border-error/30 hover:bg-error-container/10 text-error rounded-lg font-label-lg text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';

const Header = ({ onMenuClick, onAddContactClick }) => {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced suggestion retrieval
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/contacts/suggestions?q=${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setSuggestions(data.suggestions);
        }
      } catch (err) {
        console.error('Error fetching autocomplete suggestions:', err.message);
      }
    }, 250); // 250ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, token]);

  const handleSuggestionClick = (contactId) => {
    navigate(`/contacts/${contactId}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/contacts?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  return (
    <header className="h-[72px] lg:pl-64 fixed top-0 left-0 right-0 border-b border-primary/20 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl z-30 transition-all flex items-center justify-between px-md gap-md">
      {/* Left Menu toggle and branding */}
      <div className="flex items-center gap-md">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-primary hover:text-primary-fixed transition-colors p-xs flex items-center justify-center rounded-full hover:bg-surface-container-high/50"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="lg:hidden font-headline-md text-[18px] font-bold text-primary truncate">Phonebook AI</div>
      </div>

      {/* Autocomplete search bar */}
      <div className="relative flex-1 max-w-md relative group hidden md:block" ref={dropdownRef}>
        <form onSubmit={handleSearchSubmit}>
          <div className="flex items-center bg-surface-container-low border-b border-inverse-primary/30 focus-within:border-primary-container transition-colors rounded-t-sm px-sm py-xs">
            <span className="material-symbols-outlined text-on-surface-variant mr-xs">search</span>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="bg-transparent border-none outline-none text-on-surface font-body-sm w-full placeholder:text-on-surface-variant/50 focus:ring-0 px-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-on-surface-variant/60 hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </form>

        {/* Suggestion Dropdown */}
        {showDropdown && searchQuery && (
          <div className="absolute top-[48px] left-0 right-0 max-h-[320px] overflow-y-auto glass border border-primary/20 rounded-xl shadow-xl z-50 timeline-scroll">
            <div className="p-xs">
              {suggestions.length > 0 ? (
                <>
                  <div className="px-md py-sm text-[11px] font-label-md text-on-surface-variant tracking-wider uppercase border-b border-primary/10 mb-xs">
                    Suggestions
                  </div>
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSuggestionClick(item.id)}
                      className="w-full flex items-center gap-md px-md py-sm hover:bg-surface-variant/30 rounded-lg transition-colors text-left"
                    >
                      <img
                        src={item.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVJHlwCB7ZDhR_VktYTNopS99XH9ZbC7PIIUOgPfCOzgzHTSKxkKbrWJqdGeOhJ7TLKIL_iQl5k1dq7BZ_KrKtoxXlHw0brH96tocgDyCuQHU0HSKTlG4wHDnBZ_Fey36Od8RqBMTLX0oiaI6yA2QqfOXpcNft_TFb8ErqkKLSQ7PdN2Jgc2uhlsufWE2ko3vjuq8JiRWY3F-KISMDs-MRcBDKuFCPT5V_kJZJ0q-2IEjSgSKjhaZGQHJK_Er8E67l5w4YTIHsryk'}
                        alt={item.text}
                        className="w-8 h-8 rounded-full border border-primary/25 object-cover"
                      />
                      <div className="overflow-hidden">
                        <span className="block text-sm text-on-surface font-medium truncate">{item.text}</span>
                        <span className="block text-[11px] text-on-surface-variant truncate">{item.subtext}</span>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full text-center py-sm mt-xs border-t border-primary/10 text-xs font-medium text-primary hover:bg-surface-variant/30 transition-all rounded-b-lg"
                  >
                    Search matching "{searchQuery}"
                  </button>
                </>
              ) : (
                <div className="p-md text-center text-sm text-on-surface-variant">
                  No suggestions for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-sm ml-auto">
        <button className="text-primary dark:text-primary-fixed cursor-pointer active:scale-95 transition-transform p-xs rounded-full hover:bg-surface-container-high/50 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-primary dark:text-primary-fixed cursor-pointer active:scale-95 transition-transform p-xs rounded-full hover:bg-surface-container-high/50 transition-colors">
          <span className="material-symbols-outlined">settings_brightness</span>
        </button>
        
        {onAddContactClick && (
          <>
            <button
              onClick={onAddContactClick}
              className="bg-primary-container text-on-primary-container px-md py-xs rounded-full font-label-lg text-label-lg ml-sm hover:opacity-90 transition-opacity hidden md:flex items-center gap-xs shadow-[0_0_12px_rgba(184,227,233,0.15)]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Add Contact
            </button>
            <button
              onClick={onAddContactClick}
              className="md:hidden bg-primary-container text-on-primary-container h-10 w-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-[0_0_12px_rgba(184,227,233,0.15)]"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </>
        )}

        <img
          src={user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVJHlwCB7ZDhR_VktYTNopS99XH9ZbC7PIIUOgPfCOzgzHTSKxkKbrWJqdGeOhJ7TLKIL_iQl5k1dq7BZ_KrKtoxXlHw0brH96tocgDyCuQHU0HSKTlG4wHDnBZ_Fey36Od8RqBMTLX0oiaI6yA2QqfOXpcNft_TFb8ErqkKLSQ7PdN2Jgc2uhlsufWE2ko3vjuq8JiRWY3F-KISMDs-MRcBDKuFCPT5V_kJZJ0q-2IEjSgSKjhaZGQHJK_Er8E67l5w4YTIHsryk'}
          alt="User"
          className="w-8 h-8 rounded-full border border-primary/20 object-cover ml-xs cursor-pointer hover:border-primary transition-colors"
        />
      </div>
    </header>
  );
};

export default Header;

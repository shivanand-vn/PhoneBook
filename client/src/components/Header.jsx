import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../config/api';
import { useTheme } from '../context/ThemeContext';
import logoImg from '../assets/logo.jpeg';

const Header = ({ onMenuClick, onAddContactClick }) => {
  const { token, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [errorSuggestions, setErrorSuggestions] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarDropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions and avatar dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target)) {
        setAvatarDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced suggestion retrieval
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      setLoadingSuggestions(false);
      setErrorSuggestions(null);
      return;
    }

    setLoadingSuggestions(true);
    setErrorSuggestions(null);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await apiFetch(`/api/contacts/suggestions?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        if (response.ok && data.success) {
          setSuggestions(data.suggestions);
        } else {
          setErrorSuggestions('Failed to load suggestions');
        }
      } catch (err) {
        console.error('Error fetching autocomplete suggestions:', err.message);
        setErrorSuggestions('Network error');
      } finally {
        setLoadingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, token]);

  // Highlight helper for suggestions
  const highlightText = (text, highlight) => {
    if (!text) return '';
    if (!highlight.trim()) return text;
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <mark key={index} className="bg-primary/20 text-primary font-bold rounded-sm px-[2px]">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Autofill the first suggestion name into the input
  const topSuggestionName = suggestions.length > 0 ? suggestions[0].text : '';
  const ghostText =
    topSuggestionName &&
    topSuggestionName.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
    searchQuery.length > 0
      ? topSuggestionName.slice(searchQuery.length)
      : '';

  const handleSuggestionClick = (contactId, name) => {
    navigate(`/contacts/${contactId}`);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/contacts?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  // Tab key autofills ghost text
  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && ghostText) {
      e.preventDefault();
      setSearchQuery(topSuggestionName);
    }
  };

  return (
    <header className="h-[72px] lg:pl-64 fixed top-0 left-0 right-0 border-b border-primary/20 premium-header z-30 transition-all flex items-center justify-between px-md gap-md">
      {/* Left: Menu toggle and branding */}
      <div className="flex items-center gap-md">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-primary hover:text-primary-fixed transition-colors p-xs flex items-center justify-center rounded-full hover:bg-surface-container-high/50"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <img src={logoImg} alt="PhoneBook" className="lg:hidden h-8 w-8 rounded-lg object-cover border border-primary/20" />
        <div className="lg:hidden font-headline-md text-[18px] font-bold text-primary truncate hidden sm:block">PhoneBook</div>
      </div>

      {/* Glassy Autocomplete Search Bar */}
      <div className="relative flex-1 max-w-[150px] xs:max-w-[220px] sm:max-w-md md:max-w-xl block" ref={dropdownRef}>
        <form onSubmit={handleSearchSubmit}>
          <div className="relative flex items-center">
            {/* Glass background */}
            <div className="absolute inset-0 rounded-2xl bg-surface-container/40 backdrop-blur-xl border border-primary/25 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 focus-within:border-primary/60 focus-within:shadow-[0_4px_32px_rgba(var(--color-primary),0.15)]" />

            {/* Search icon */}
            <span className="relative z-10 material-symbols-outlined text-primary/70 ml-4 mr-2 text-[20px] select-none">search</span>

            {/* Ghost text overlay + real input */}
            <div className="relative flex-1 z-10 flex items-center">
              {/* Ghost autofill text */}
              {ghostText && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none font-body-sm text-[14px] whitespace-pre"
                  style={{ color: 'rgba(var(--color-on-surface-variant) / 0.4)' }}
                >
                  <span style={{ color: 'transparent' }}>{searchQuery}</span>{ghostText}
                </span>
              )}
              <input
                ref={inputRef}
                type="text"
                placeholder="Search contacts…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-on-surface font-body-sm text-[14px] w-full placeholder:text-on-surface-variant/40 focus:ring-0 px-0 py-3 caret-primary relative z-10"
                style={{ background: 'transparent' }}
              />
            </div>

            {/* Clear button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                className="relative z-10 text-on-surface-variant/60 hover:text-on-surface mr-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}

            {/* Search submit button */}
            <button
              type="submit"
              className="relative z-10 mr-2 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold border border-primary/20 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              ⏎
            </button>
          </div>
        </form>

        {/* Glassy Suggestion Dropdown */}
        {showDropdown && searchQuery && (
          <div className="absolute top-[56px] left-0 right-0 max-h-[320px] overflow-y-auto rounded-2xl shadow-2xl z-50 timeline-scroll border border-primary/20 overflow-hidden"
            style={{
              background: 'rgba(var(--color-surface-container-low) / 0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="p-2">
              {loadingSuggestions ? (
                <div className="p-4 text-center text-sm text-on-surface-variant flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[28px] text-primary animate-spin">sync</span>
                  Searching...
                </div>
              ) : errorSuggestions ? (
                <div className="p-4 text-center text-sm text-error flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[28px] text-error">error</span>
                  {errorSuggestions}
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-[10px] font-semibold text-on-surface-variant/70 tracking-widest uppercase border-b border-primary/10 mb-1">
                    Suggestions
                  </div>
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSuggestionClick(item.id, item.text)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/10 rounded-xl transition-all duration-150 text-left group"
                    >
                      <img
                        src={item.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVJHlwCB7ZDhR_VktYTNopS99XH9ZbC7PIIUOgPfCOzgzHTSKxkKbrWJqdGeOhJ7TLKIL_iQl5k1dq7BZ_KrKtoxXlHw0brH96tocgDyCuQHU0HSKTlG4wHDnBZ_Fey36Od8RqBMTLX0oiaI6yA2QqfOXpcNft_TFb8ErqkKLSQ7PdN2Jgc2uhlsufWE2ko3vjuq8JiRWY3F-KISMDs-MRcBDKuFCPT5V_kJZJ0q-2IEjSgSKjhaZGQHJK_Er8E67l5w4YTIHsryk'}
                        alt={item.text}
                        className="w-8 h-8 rounded-full border border-primary/25 object-cover flex-shrink-0"
                      />
                      <div className="overflow-hidden flex-1">
                        {/* Highlight matching part of name and subtext */}
                        <span className="block text-sm text-on-surface font-medium truncate">
                          {highlightText(item.text, searchQuery)}
                        </span>
                        <span className="block text-[11px] text-on-surface-variant truncate">
                          {highlightText(item.subtext, searchQuery)}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant/40 group-hover:text-primary transition-colors">arrow_forward</span>
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full text-center py-2.5 mt-1 border-t border-primary/10 text-xs font-semibold text-primary hover:bg-primary/10 transition-all rounded-b-xl flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[14px]">search</span>
                    Search all results for "{searchQuery}"
                  </button>
                </>
              ) : (
                <div className="p-4 text-center text-sm text-on-surface-variant flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-[28px] text-on-surface-variant/30">search_off</span>
                  No suggestions for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls – notification bell removed */}
      <div className="flex items-center gap-sm ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="text-on-surface-variant hover:text-primary cursor-pointer active:scale-95 transition-all p-xs rounded-full hover:bg-surface-container-high/50"
        >
          <span className="material-symbols-outlined">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Add Contact button */}
        {onAddContactClick && (
          <>
            <button
              onClick={onAddContactClick}
              className="bg-primary-container text-on-primary-container px-md py-xs rounded-full font-label-lg text-label-lg ml-sm hover:opacity-90 transition-all duration-200 hidden md:flex items-center gap-xs shadow-[0_0_16px_rgba(var(--color-primary-container),0.3)] hover:shadow-[0_0_24px_rgba(var(--color-primary-container),0.4)] hover:scale-105 active:scale-95 font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Add Contact
            </button>
            <button
              onClick={onAddContactClick}
              className="md:hidden bg-primary-container text-on-primary-container h-10 w-10 rounded-full flex items-center justify-center hover:opacity-90 transition-all shadow-[0_0_16px_rgba(var(--color-primary-container),0.3)] active:scale-95"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </>
        )}

        {/* Avatar + Glassy Dropdown */}
        <div className="relative" ref={avatarDropdownRef}>
          <button
            onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full border border-primary/20 hover:border-primary/50 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <img
              src={user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVJHlwCB7ZDhR_VktYTNopS99XH9ZbC7PIIUOgPfCOzgzHTSKxkKbrWJqdGeOhJ7TLKIL_iQl5k1dq7BZ_KrKtoxXlHw0brH96tocgDyCuQHU0HSKTlG4wHDnBZ_Fey36Od8RqBMTLX0oiaI6yA2QqfOXpcNft_TFb8ErqkKLSQ7PdN2Jgc2uhlsufWE2ko3vjuq8JiRWY3F-KISMDs-MRcBDKuFCPT5V_kJZJ0q-2IEjSgSKjhaZGQHJK_Er8E67l5w4YTIHsryk'}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>

          {avatarDropdownOpen && (
            <div
              className="absolute right-0 mt-3 w-60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] z-50 overflow-hidden border border-white/30 dark:border-primary/20"
              style={{
                background: 'linear-gradient(135deg, rgb(var(--color-surface-container-lowest) / 0.45) 0%, rgb(var(--color-surface-container-lowest) / 0.15) 100%)',
                backdropFilter: 'blur(25px)',
                WebkitBackdropFilter: 'blur(25px)',
              }}
            >
              {/* User info header */}
              <div className="px-4 py-4 border-b border-primary/10"
                style={{ background: 'rgba(var(--color-primary-container) / 0.08)' }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVJHlwCB7ZDhR_VktYTNopS99XH9ZbC7PIIUOgPfCOzgzHTSKxkKbrWJqdGeOhJ7TLKIL_iQl5k1dq7BZ_KrKtoxXlHw0brH96tocgDyCuQHU0HSKTlG4wHDnBZ_Fey36Od8RqBMTLX0oiaI6yA2QqfOXpcNft_TFb8ErqkKLSQ7PdN2Jgc2uhlsufWE2ko3vjuq8JiRWY3F-KISMDs-MRcBDKuFCPT5V_kJZJ0q-2IEjSgSKjhaZGQHJK_Er8E67l5w4YTIHsryk'}
                    alt="User"
                    className="w-10 h-10 rounded-full border border-primary/30 object-cover flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate text-on-surface">{user?.name}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <button
                  onClick={() => { setAvatarDropdownOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-primary/10 rounded-xl transition-all duration-150 text-left text-sm font-medium text-on-surface group"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-[16px] text-primary">account_circle</span>
                  </div>
                  My Profile
                </button>

                <div className="my-1.5 border-t border-primary/10" />

                <button
                  onClick={() => { setAvatarDropdownOpen(false); logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-error/10 rounded-xl transition-all duration-150 text-left text-sm font-medium text-error group"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-error/10 group-hover:bg-error/20 transition-colors">
                    <span className="material-symbols-outlined text-[16px] text-error">logout</span>
                  </div>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

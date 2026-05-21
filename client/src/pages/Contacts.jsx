import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../config/api';
import ContactModal from '../components/ContactModal';
import ConfirmModal from '../components/ConfirmModal';

const Contacts = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Contact list state
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showingFrom, setShowingFrom] = useState(0);
  const [showingTo, setShowingTo] = useState(0);

  // Filters (bind to URL state or component state)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(searchParams.get('favorite') === 'true');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get('company') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'name');

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Unique companies and tags for filters
  const [allTags, setAllTags] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);

  // Fetch unique tags & companies for filtering
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await apiFetch('/api/contacts?limit=1000');
        const data = await response.json();
        if (response.ok && data.success) {
          const tagsSet = new Set();
          const companiesSet = new Set();
          data.contacts.forEach(c => {
            if (c.company) companiesSet.add(c.company);
            if (c.tags) c.tags.forEach(t => tagsSet.add(t));
          });
          setAllTags([...tagsSet]);
          setAllCompanies([...companiesSet]);
        }
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    fetchMetadata();
  }, [contacts, token]);

  // Sync Search Query from URL Search Params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
    const urlFav = searchParams.get('favorite');
    if (urlFav !== null) {
      setShowFavoritesOnly(urlFav === 'true');
    }
  }, [searchParams]);

  // Fetch Contacts on Filter or Page changes
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const endpoint = searchQuery.trim() 
        ? `/api/contacts/search?q=${encodeURIComponent(searchQuery.trim())}`
        : `/api/contacts`;

      let queryParams = [];
      if (!searchQuery.trim()) {
        queryParams.push(`page=${page}`);
        queryParams.push(`limit=9`); // 9 items per page fits 3-column grid perfectly
        if (showFavoritesOnly) queryParams.push('favorite=true');
        if (selectedTag) queryParams.push(`tag=${encodeURIComponent(selectedTag)}`);
        if (selectedCompany) queryParams.push(`company=${encodeURIComponent(selectedCompany)}`);
        if (sortBy) queryParams.push(`sortBy=${sortBy}`);
      }

      const url = queryParams.length > 0 ? `${endpoint}?${queryParams.join('&')}` : endpoint;

      const response = await apiFetch(url);

      const data = await response.json();
      if (response.ok && data.success) {
        if (searchQuery.trim()) {
          setContacts(data.contacts);
          setTotalCount(data.contacts.length);
          setShowingFrom(data.contacts.length > 0 ? 1 : 0);
          setShowingTo(data.contacts.length);
          setTotalPages(1);
        } else {
          setContacts(data.contacts);
          setTotalCount(data.pagination.total);
          setShowingFrom(data.pagination.showingFrom);
          setShowingTo(data.pagination.showingTo);
          setTotalPages(data.pagination.pages);
        }
      }
    } catch (err) {
      showToast('Failed to load contacts list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (showFavoritesOnly) params.favorite = 'true';
    if (selectedTag) params.tag = selectedTag;
    if (selectedCompany) params.company = selectedCompany;
    if (sortBy !== 'name') params.sortBy = sortBy;
    setSearchParams(params);
  }, [page, showFavoritesOnly, selectedTag, selectedCompany, sortBy, searchQuery, token]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFavoriteToggle = async (e, contactId) => {
    e.stopPropagation();
    try {
      const response = await apiFetch(`/api/contacts/${contactId}/favorite`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(data.message);
        setContacts(contacts.map(c => c._id === contactId ? { ...c, favorite: data.favorite } : c));
      }
    } catch (err) {
      showToast('Failed to toggle favorite status', 'error');
    }
  };

  const handleDeleteContact = (e, contactId) => {
    e.stopPropagation();
    setDeleteConfirmId(contactId);
  };

  const handleConfirmDelete = async () => {
    const contactId = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      const response = await apiFetch(`/api/contacts/${contactId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        showToast('Contact deleted successfully');
        fetchContacts();
      }
    } catch (err) {
      showToast('Failed to delete contact', 'error');
    }
  };

  const handleOpenAddModal = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e, contact) => {
    e.stopPropagation();
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveSuccess = (savedContact, type) => {
    showToast(type === 'create' ? 'Contact added successfully' : 'Contact updated successfully');
    fetchContacts();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setShowFavoritesOnly(false);
    setSelectedTag('');
    setSelectedCompany('');
    setSortBy('name');
    setPage(1);
    setSearchParams({});
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-md relative">
      {/* Toast Alert Notification */}
      {toast && (
        <div className={`fixed top-[84px] right-md z-[100] px-md py-sm rounded-lg shadow-lg flex items-center gap-sm border transition-all ${
          toast.type === 'error' 
            ? 'bg-error-container/30 border-error/50 text-error' 
            : 'bg-surface-container-high/90 border-primary/40 text-primary'
        } backdrop-blur-md`}>
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-md">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">Contacts Database</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Manage and organize your professional network.</p>
        </div>
        <div className="flex gap-sm w-full md:w-auto">
          <button 
            onClick={handleOpenAddModal}
            className="flex-1 md:flex-none flex items-center justify-center gap-xs px-md py-sm bg-primary-container text-on-primary-container rounded-full font-label-lg text-label-lg transition-all duration-300 shadow-[0_0_16px_rgba(var(--color-primary-container),0.3)] hover:shadow-[0_0_24px_rgba(var(--color-primary-container),0.5)] hover:scale-105 active:scale-95 font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Add Contact
          </button>
        </div>
      </div>

      {/* Bento Grid layout for overview stats and filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        {/* Total Contacts Count Bento Card */}
        <div className="lg:col-span-4 bg-surface-container-low border border-primary/20 rounded-xl p-md flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors shadow-sm">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl group-hover:bg-primary-container/20 transition-colors"></div>
          <div>
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-sm text-headline-sm text-primary">Total Contacts</h3>
              <span className="material-symbols-outlined text-primary-fixed-dim">group</span>
            </div>
            <p className="font-headline-xl text-headline-xl text-on-surface">{totalCount}</p>
          </div>
          <div className="mt-lg flex gap-sm">
            <div className="flex items-center gap-xs bg-primary-container/10 text-primary-fixed-dim px-sm py-xs rounded-full font-label-md text-label-md border border-primary-container/20">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +12% this month
            </div>
          </div>
        </div>

        {/* Active segments & quick filters Bento Card */}
        <div className="lg:col-span-8 bg-surface-container-low border border-primary/20 rounded-xl p-md shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-md">Active Segments</h3>
            <div className="flex flex-wrap gap-xs">
              <span 
                onClick={() => { setSelectedTag(''); setPage(1); }}
                className={`px-sm py-xs bg-surface-container border rounded-full font-label-md text-label-md text-on-surface flex items-center gap-xs hover:border-primary transition-colors cursor-pointer ${
                  selectedTag === '' ? 'border-primary' : 'border-inverse-primary/30'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-primary-container"></span> All
              </span>
              {allTags.slice(0, 5).map((tag, idx) => {
                const colors = ['bg-primary-container', 'bg-secondary', 'bg-tertiary-fixed-dim', 'bg-outline'];
                return (
                  <span 
                    key={tag}
                    onClick={() => { setSelectedTag(selectedTag === tag ? '' : tag); setPage(1); }}
                    className={`px-sm py-xs bg-surface-container border rounded-full font-label-md text-label-md text-on-surface flex items-center gap-xs hover:border-primary transition-colors cursor-pointer ${
                      selectedTag === tag ? 'border-primary' : 'border-inverse-primary/30'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`}></span> {tag}
                  </span>
                );
              })}
              {allTags.length === 0 && selectedTag !== '' && (
                <span className="text-xs text-on-surface-variant/50">No segments defined yet.</span>
              )}
            </div>
          </div>
          <div className="mt-md pt-sm border-t border-primary/10 flex flex-wrap gap-sm items-center justify-between">
            <div className="flex flex-wrap gap-sm">
              {/* Favorites toggle */}
              <button
                onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setPage(1); }}
                className={`h-[32px] px-md rounded-full text-xs font-semibold border transition-all duration-300 flex items-center gap-xs hover:scale-105 active:scale-95 ${
                  showFavoritesOnly
                    ? 'bg-primary-container/15 border-primary text-primary-container shadow-sm'
                    : 'border-outline/20 text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                Favorites
              </button>

              {/* Company selection */}
              <select
                value={selectedCompany}
                onChange={(e) => { setSelectedCompany(e.target.value); setPage(1); }}
                className="h-[32px] px-md bg-surface-container/60 border border-outline/20 rounded-full text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer hover:border-primary transition-colors font-semibold"
              >
                <option value="">All Companies</option>
                {allCompanies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Sorting selector */}
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="h-[32px] px-md bg-surface-container/60 border border-outline/20 rounded-full text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer hover:border-primary transition-colors font-semibold"
              >
                <option value="name">Sort: Alphabetical</option>
                <option value="recently_added">Sort: Recently Added</option>
                <option value="company">Sort: Company</option>
              </select>
            </div>

            {/* Clear filters trigger */}
            {(searchQuery || showFavoritesOnly || selectedTag || selectedCompany || sortBy !== 'name') && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary-fixed-dim hover:text-primary transition-colors flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[14px]">filter_alt_off</span> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <section className="mt-md">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface-container-low border border-primary/10 rounded-lg p-sm h-[130px] animate-pulse flex flex-col justify-between">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded bg-surface-container-high"></div>
                  <div className="space-y-sm flex-1">
                    <div className="h-4 bg-surface-container-high rounded w-3/4"></div>
                    <div className="h-3 bg-surface-container-high rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-surface-container-high rounded w-1/4 mt-auto"></div>
              </div>
            ))}
          </div>
        ) : contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => navigate(`/contacts/${contact._id}`)}
                className="bg-surface-container-highest/30 border border-primary/20 rounded-lg p-sm relative group hover:bg-surface-container-highest/50 transition-all duration-200 flex flex-col justify-between cursor-pointer hover:border-primary/40 shadow-[0_0_12px_rgba(0,0,0,0.15)] min-h-[140px]"
              >
                {/* Accent highlights */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-container rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Star Favorite absolute indicator */}
                <button
                  onClick={(e) => handleFavoriteToggle(e, contact._id)}
                  className="absolute right-sm top-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className={`material-symbols-outlined text-[20px] ${contact.favorite ? 'text-secondary filled' : 'opacity-30 group-hover:opacity-100'}`}>
                    star
                  </span>
                </button>

                <div className="flex items-start gap-sm">
                  {/* Photo or Initials block */}
                  {contact.profileImage ? (
                    <img
                      src={contact.profileImage}
                      alt={contact.name}
                      className="w-10 h-10 rounded bg-primary/10 border border-primary/20 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center font-headline-sm text-headline-sm text-primary-container flex-shrink-0">
                      {getInitials(contact.name)}
                    </div>
                  )}

                  {/* Text labels */}
                  <div className="overflow-hidden pr-6">
                    <h4 className="font-label-lg text-label-lg text-on-surface font-semibold truncate group-hover:text-primary transition-colors">{contact.name}</h4>
                    <p className="font-code-sm text-code-sm text-primary truncate mt-[2px] font-medium">{contact.company || 'Private Address'}</p>
                    {contact.email && (
                      <p className="text-[11px] text-on-surface-variant/80 truncate mt-[2px]">{contact.email}</p>
                    )}
                    <p className="text-[11px] text-on-surface-variant/70 mt-[4px] font-mono">{contact.phone}</p>
                  </div>
                </div>

                {/* Tags and Action icons bottom bar */}
                <div className="mt-sm pt-xs border-t border-primary/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-xs overflow-hidden max-w-[160px] h-[20px]">
                    {contact.tags && contact.tags.slice(0, 2).map(t => (
                      <span key={t} className="px-xs py-[2px] bg-primary/15 text-primary rounded font-label-md text-[10px] border border-primary/30 leading-none font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-xs">
                    <button
                      onClick={(e) => handleOpenEditModal(e, contact)}
                      className="w-7 h-7 rounded hover:bg-surface-variant/40 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={(e) => handleDeleteContact(e, contact._id)}
                      className="w-7 h-7 rounded hover:bg-error-container/10 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-low border border-primary/25 rounded-xl p-xl text-center shadow-md">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20 mb-md">person_search</span>
            <p className="text-sm text-on-surface-variant">No contacts matching criteria found</p>
            {(searchQuery || showFavoritesOnly || selectedTag || selectedCompany) && (
              <button
                onClick={clearFilters}
                className="mt-sm text-xs font-semibold text-primary hover:text-inverse-primary transition-colors underline"
              >
                Clear all search filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* Pagination Footer */}
      {!searchQuery.trim() && contacts.length > 0 && (
        <section className="bg-surface-container-low/40 border border-primary/10 rounded-lg p-sm flex items-center justify-between text-xs text-on-surface-variant shadow-sm mt-md">
          <span>Showing {showingFrom} - {showingTo} of {totalCount} contacts</span>
          <div className="flex items-center gap-md">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="w-8 h-8 rounded-full border border-outline/20 flex items-center justify-center hover:bg-surface-container-high text-on-surface hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all hover:scale-105 active:scale-95 duration-200"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <span className="font-semibold text-on-surface">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-full border border-outline/20 flex items-center justify-center hover:bg-surface-container-high text-on-surface hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all hover:scale-105 active:scale-95 duration-200"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </section>
      )}

      {/* Edit/Add Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        onSaveSuccess={handleSaveSuccess}
      />

      {/* Custom delete confirm modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};

export default Contacts;

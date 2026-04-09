import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchItemsAPI } from '@/services/item.service';
import { CATEGORIES } from '@/utils/constants';
import ItemCard from '@/components/ItemCard';
import Spinner  from '@/components/ui/Spinner';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);

  const [filters, setFilters] = useState({
    type:     searchParams.get('type')     || '',
    category: searchParams.get('category') || '',
    search:   searchParams.get('search')   || '',
    page:     1,
  });
  const [searchInput, setSearchInput] = useState(filters.search);

  const load = useCallback(async (f) => {
    setLoading(true);
    try {
      const { data } = await fetchItemsAPI({ ...f, limit: 12 });
      setItems(data.data.items || []);
      setTotal(data.data.total || 0);
      setPages(data.data.pages || 1);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(filters); }, [filters]);

  const setFilter = (key, val) => setFilters((p) => ({ ...p, [key]: val, page: 1 }));

  const handleSearch = (e) => { e.preventDefault(); setFilter('search', searchInput); };

  const clearAll = () => { setFilters({ type: '', category: '', search: '', page: 1 }); setSearchInput(''); };

  const hasFilters = filters.type || filters.category || filters.search;

  return (
    <div className="page-section">
      <div className="page-wrap">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-gray-900">Browse Items</h1>
          <p className="text-gray-500 mt-1">{total} item{total !== 1 ? 's' : ''} found</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input className="input flex-1" placeholder="Search by title, description, keyword…"
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <button type="submit" className="btn-primary">Search</button>
          {hasFilters && <button type="button" className="btn-secondary" onClick={clearAll}>Clear</button>}
        </form>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-52 flex-shrink-0 hidden md:block space-y-4">
            <div className="card card-body">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Item Type</p>
              {[{ v: '', l: 'All Items' }, { v: 'lost', l: '🔴 Lost' }, { v: 'found', l: '🟢 Found' }].map(({ v, l }) => (
                <label key={v} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input type="radio" name="type" checked={filters.type === v} onChange={() => setFilter('type', v)}
                    className="accent-brand-600" />
                  <span className={`text-sm font-medium ${filters.type === v ? 'text-brand-700' : 'text-gray-600'}`}>{l}</span>
                </label>
              ))}
            </div>
            <div className="card card-body">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Category</p>
              <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                <input type="radio" name="cat" checked={filters.category === ''} onChange={() => setFilter('category', '')} className="accent-brand-600" />
                <span className={`text-sm font-medium ${!filters.category ? 'text-brand-700' : 'text-gray-600'}`}>All</span>
              </label>
              {CATEGORIES.map(({ value, label, icon }) => (
                <label key={value} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input type="radio" name="cat" checked={filters.category === value} onChange={() => setFilter('category', value)} className="accent-brand-600" />
                  <span className={`text-sm font-medium ${filters.category === value ? 'text-brand-700' : 'text-gray-600'}`}>{icon} {label}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters */}
            <div className="flex gap-2 mb-4 md:hidden overflow-x-auto scrollbar-hide pb-1">
              {[{ v: '', l: 'All' }, { v: 'lost', l: '🔴 Lost' }, { v: 'found', l: '🟢 Found' }].map(({ v, l }) => (
                <button key={v} onClick={() => setFilter('type', v)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filters.type === v ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                  {l}
                </button>
              ))}
              {CATEGORIES.map(({ value, icon }) => (
                <button key={value} onClick={() => setFilter('category', filters.category === value ? '' : value)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filters.category === value ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                  {icon}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="font-semibold text-gray-700 mb-1">No items found</p>
                <p className="text-sm text-gray-400">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => <ItemCard key={item._id} item={item} />)}
                </div>
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button className="btn-secondary btn-sm" disabled={filters.page === 1}
                      onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}>← Prev</button>
                    <span className="text-sm text-gray-500">Page {filters.page} of {pages}</span>
                    <button className="btn-secondary btn-sm" disabled={filters.page === pages}
                      onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

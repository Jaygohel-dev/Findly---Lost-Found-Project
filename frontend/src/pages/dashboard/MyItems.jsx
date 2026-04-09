import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyItemsAPI, deleteItemAPI, recoverItemAPI } from '@/services/item.service';
import { TypeBadge, StatusBadge, CategoryBadge } from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'all',       label: 'All' },
  { key: 'lost',      label: 'Lost' },
  { key: 'found',     label: 'Found' },
  { key: 'recovered', label: 'Recovered' },
];

export default function MyItems() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('all');

  useEffect(() => {
    fetchMyItemsAPI()
      .then(({ data }) => setItems(data.data.items || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteItemAPI(id);
      setItems((p) => p.filter((i) => i._id !== id));
      toast.success('Item deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleRecover = async (id) => {
    try {
      await recoverItemAPI(id);
      setItems((p) => p.map((i) => i._id === id ? { ...i, status: 'recovered' } : i));
      toast.success('Marked as recovered! 🎉');
    } catch { toast.error('Failed to update'); }
  };

  const filtered = tab === 'all' ? items
    : tab === 'recovered' ? items.filter((i) => i.status === 'recovered')
    : items.filter((i) => i.type === tab);

  const counts = {
    all:       items.length,
    lost:      items.filter((i) => i.type === 'lost').length,
    found:     items.filter((i) => i.type === 'found').length,
    recovered: items.filter((i) => i.status === 'recovered').length,
  };

  return (
    <div className="page-section">
      <div className="page-wrap">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">My Items</h1>
            <p className="text-gray-500 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} reported</p>
          </div>
          <Link to="/items/report" className="btn-primary">+ Report Item</Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${tab === key ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-brand-100 text-brand-700' : 'bg-gray-200 text-gray-500'}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-semibold text-gray-700 mb-2">No items here yet</p>
            <p className="text-sm text-gray-400 mb-6">Report your first lost or found item to get started.</p>
            <Link to="/items/report" className="btn-primary">Report an Item</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item._id} className="card card-body flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-card-hover transition-shadow">
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center text-2xl">
                  {item.images?.[0]
                    ? <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    : '📦'
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <TypeBadge type={item.type} />
                    <StatusBadge status={item.status} />
                    <CategoryBadge category={item.category} />
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    📍 {item.location?.address} &nbsp;·&nbsp; {formatDate(item.date)}
                  </p>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/items/${item._id}`} className="btn-secondary btn-sm">View</Link>
                  {item.status === 'active' && (
                    <button onClick={() => handleRecover(item._id)} className="btn-primary btn-sm">Recovered</button>
                  )}
                  <button onClick={() => handleDelete(item._id)} className="btn-danger btn-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '@/services/api';
import Avatar  from '@/components/ui/Avatar';
import Spinner from '@/components/ui/Spinner';
import { TypeBadge, StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

const TABS = [['overview', '📊 Overview'], ['users', '👥 Users'], ['items', '📋 Items']];

export default function AdminPanel() {
  const [tab,     setTab]     = useState('overview');
  const [stats,   setStats]   = useState(null);
  const [users,   setUsers]   = useState([]);
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/users'), api.get('/admin/items')])
      .then(([s, u, i]) => { setStats(s.data.data); setUsers(u.data.data.users); setItems(i.data.data.items); })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const toggleUser = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle`);
      setUsers((p) => p.map((u) => u._id === id ? data.data.user : u));
      toast.success('User status updated');
    } catch { toast.error('Failed'); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/admin/items/${id}`);
      setItems((p) => p.filter((i) => i._id !== id));
      toast.success('Item deleted');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size="xl" /></div>;

  return (
    <div className="page-section">
      <div className="page-wrap">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 mt-1">Manage Findly platform</p>
          </div>
          <span className="badge bg-gray-900 text-white">🛡 Administrator</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && stats && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: '👥', label: 'Total Users',     value: stats.users,       accent: 'text-blue-600   bg-blue-50' },
                { icon: '📝', label: 'Total Items',     value: stats.totalItems,  accent: 'text-gray-600   bg-gray-100' },
                { icon: '🔴', label: 'Lost Items',      value: stats.lostItems,   accent: 'text-red-600    bg-red-50' },
                { icon: '🟢', label: 'Found Items',     value: stats.foundItems,  accent: 'text-green-600  bg-green-50' },
                { icon: '✅', label: 'Recovered',       value: stats.recovered,   accent: 'text-purple-600 bg-purple-50' },
                { icon: '🔗', label: 'Matched',         value: stats.matched,     accent: 'text-orange-600 bg-orange-50' },
              ].map(({ icon, label, value, accent }) => (
                <div key={label} className="card card-body flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${accent}`}>{icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card card-body">
              <h3 className="font-semibold text-gray-900 mb-3">Recovery Rate</h3>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full transition-all duration-700"
                  style={{ width: `${stats.recoveryRate || 0}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-2">{stats.recoveryRate || 0}% of all reported items have been recovered</p>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">All Users</h2>
              <span className="badge badge-active">{users.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['User', 'Email', 'Role', 'Reports', 'Rating', 'Status', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={u.name} size="sm" />
                          <span className="font-semibold text-gray-800 whitespace-nowrap">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge text-xs ${u.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center text-gray-600">{u.itemsReported || 0}</td>
                      <td className="px-5 py-3.5 text-gray-600">{u.rating > 0 ? `⭐ ${u.rating}` : '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${u.isActive ? 'badge-active' : 'badge-closed'}`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        {u.role !== 'admin' && (
                          <button onClick={() => toggleUser(u._id)}
                            className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-primary'}`}>
                            {u.isActive ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Items */}
        {tab === 'items' && (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">All Items</h2>
              <span className="badge badge-active">{items.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Title', 'Type', 'Category', 'Owner', 'Location', 'Status', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-gray-800 max-w-[160px] truncate">{item.title}</td>
                      <td className="px-5 py-3.5"><TypeBadge type={item.type} /></td>
                      <td className="px-5 py-3.5 text-gray-500 capitalize text-xs">{item.category}</td>
                      <td className="px-5 py-3.5 text-gray-600 text-xs whitespace-nowrap">{item.owner?.name}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs max-w-[160px] truncate">{item.location?.address}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{formatDate(item.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => deleteItem(item._id)} className="btn-danger btn-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { fetchStatsAPI } from '@/services/item.service';
import { formatDate } from '@/utils/helpers';
import Avatar from '@/components/ui/Avatar';

const StatCard = ({ icon, label, value, accent }) => {
  const accents = {
    green:  'bg-brand-50 text-brand-700',
    blue:   'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    orange: 'bg-orange-50 text-orange-700',
  };
  return (
    <div className="card card-body flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${accents[accent] || accents.green}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStatsAPI().then(({ data }) => setStats(data.data)).catch(() => {});
  }, []);

  return (
    <div className="page-section">
      <div className="page-wrap space-y-6">
        {/* Welcome banner */}
        <div className="card card-body bg-gradient-to-r from-brand-600 to-brand-700 text-white border-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar name={user?.name} src={user?.avatar} size="lg" className="border-2 border-brand-400" />
              <div>
                <p className="text-brand-200 text-sm font-medium">Welcome back 👋</p>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-brand-200 text-sm capitalize">
                  {user?.role} · Member since {user?.createdAt ? formatDate(user.createdAt) : '—'}
                </p>
              </div>
            </div>
            <Link to="/items/report" className="btn bg-white/10 border border-white/20 text-white hover:bg-white/20 text-sm flex-shrink-0">
              + Report Item
            </Link>
          </div>
        </div>

        {/* Platform stats */}
        {stats && (
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-3">Platform Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="📝" label="Total Reports"    value={stats.total}    accent="green" />
              <StatCard icon="🔴" label="Active Lost"      value={stats.lost}     accent="orange" />
              <StatCard icon="🟢" label="Active Found"     value={stats.found}    accent="blue" />
              <StatCard icon="✅" label="Recovered"        value={stats.recovered} accent="purple" />
            </div>
          </div>
        )}

        {/* My account summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 card card-body">
            <h2 className="font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-3">
              {[
                { label: 'Full Name',   value: user?.name },
                { label: 'Email',       value: user?.email },
                { label: 'Phone',       value: user?.phone || '—' },
                { label: 'City',        value: user?.city  || '—' },
                { label: 'Role',        value: user?.role,   cls: 'capitalize' },
                { label: 'Rating',      value: user?.rating ? `⭐ ${user.rating} (${user.totalRatings} reviews)` : 'No ratings yet' },
                { label: 'Items Reported',  value: user?.itemsReported  || 0 },
                { label: 'Items Recovered', value: user?.itemsRecovered || 0 },
              ].map(({ label, value, cls }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className={`text-sm font-semibold text-gray-800 ${cls || ''}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {[
              { icon: '📋', title: 'My Items',    desc: 'View and manage your reports', to: '/my-items',    color: 'bg-brand-50 text-brand-600' },
              { icon: '💬', title: 'Messages',    desc: 'View your conversations',       to: '/messages',    color: 'bg-blue-50 text-blue-600' },
              { icon: '👤', title: 'Edit Profile', desc: 'Update name, city, password', to: '/profile',     color: 'bg-purple-50 text-purple-600' },
              { icon: '🔍', title: 'Browse Items', desc: 'Search lost & found items',   to: '/items',       color: 'bg-orange-50 text-orange-600' },
            ].map(({ icon, title, desc, to, color }) => (
              <Link key={to} to={to} className="card card-body flex items-center gap-3 hover:shadow-card-hover transition-all hover:-translate-y-0.5 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${color}`}>{icon}</div>
                <div>
                  <p className="font-semibold text-sm text-gray-800 group-hover:text-brand-700 transition-colors">{title}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { fetchStatsAPI, fetchItemsAPI } from '@/services/item.service';
import ItemCard from '@/components/ItemCard';
import Spinner  from '@/components/ui/Spinner';

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Matching',   desc: 'Smart algorithms automatically match lost items with found reports by category, location, and description.' },
  { icon: '📱', title: 'QR Code Integration',    desc: 'Attach QR codes to valuables. Anyone who finds them can instantly scan and report or return your item.' },
  { icon: '📍', title: 'Location-Based Search',  desc: 'GPS-powered proximity search helps you find items reported in the exact area where you lost them.' },
  { icon: '💬', title: 'Secure Messaging',       desc: 'Anonymous communication channel between owners and finders until recovery is confirmed.' },
  { icon: '⭐', title: 'Trust & Ratings',        desc: 'Build community trust with mutual ratings and reviews after every successful item recovery.' },
  { icon: '🔔', title: 'Instant Notifications',  desc: 'Real-time alerts the moment a potential match is found or someone messages you about your item.' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search,  setSearch]  = useState('');
  const [stats,   setStats]   = useState(null);
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStatsAPI(), fetchItemsAPI({ limit: 6 })])
      .then(([s, i]) => { setStats(s.data.data); setItems(i.data.data.items || []); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-brand-50 via-white to-gray-50 border-b border-gray-100">
        <div className="page-wrap py-20 lg:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-100 text-brand-700 rounded-full text-xs font-bold mb-6 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse-dot" />
              Smart Lost & Found Platform
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-5 text-balance">
              Lost something? <span className="text-brand-600">Findly</span> helps you get it back.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
              Connect with finders in your area using AI matching, QR codes, and real-time notifications.
              Over <strong className="text-gray-700">{stats?.recovered || '1,000'}+</strong> items recovered.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); navigate(`/items?search=${search}`); }}
              className="flex gap-2 max-w-lg mx-auto mb-8">
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lost or found items near you…"
                className="input flex-1 shadow-sm text-base py-3 px-5 rounded-2xl" />
              <button type="submit" className="btn-primary px-6 py-3 rounded-2xl text-base">Search</button>
            </form>
            <div className="flex flex-wrap gap-3 justify-center">
              {isAuthenticated
                ? <Link to="/items/report" className="btn-primary btn-lg">+ Report an Item</Link>
                : <>
                    <Link to="/auth/register" className="btn-primary btn-lg">Get started free</Link>
                    <Link to="/items"         className="btn-secondary btn-lg">Browse Items</Link>
                  </>
              }
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      {stats && (
        <section className="bg-white border-b border-gray-100 py-10">
          <div className="page-wrap grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { v: stats.total,     l: 'Items Reported',       emoji: '📝' },
              { v: stats.recovered, l: 'Successfully Recovered', emoji: '✅' },
              { v: stats.matched,   l: 'Active Matches',        emoji: '🔗' },
              { v: stats.users,     l: 'Community Members',     emoji: '👥' },
            ].map(({ v, l, emoji }) => (
              <div key={l}>
                <div className="text-3xl mb-1">{emoji}</div>
                <div className="font-serif text-3xl font-bold text-brand-700">{(v || 0).toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Recent Items ─────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="page-wrap">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-gray-900">Recent Items</h2>
              <p className="text-gray-500 mt-1">Latest lost & found reports</p>
            </div>
            <Link to="/items" className="btn-secondary btn-sm hidden sm:flex">View all →</Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="font-medium text-gray-600">No items yet. Be the first to report one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => <ItemCard key={item._id} item={item} />)}
            </div>
          )}
          <div className="mt-6 text-center sm:hidden">
            <Link to="/items" className="btn-secondary">View all items →</Link>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="page-wrap">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-gray-900">How Findly Works</h2>
            <p className="text-gray-500 mt-2">Recover your lost items in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', icon: '📝', t: 'Report Your Item',    d: 'Submit a detailed report with photos, location, and description of your lost or found item.' },
              { n: '02', icon: '🤖', t: 'AI Matches Items',    d: 'Our smart algorithm scans the database and automatically matches lost items with found reports.' },
              { n: '03', icon: '🤝', t: 'Connect & Recover',  d: 'Securely message the finder, arrange handover, and rate your experience.' },
            ].map((s) => (
              <div key={s.n} className="card card-body text-center hover:shadow-card-hover transition-shadow">
                <div className="text-xs font-bold text-brand-500 tracking-widest uppercase mb-3">{s.n}</div>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.t}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="page-wrap">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-gray-900">Why Choose Findly?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="card card-body hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="bg-brand-700 py-20">
          <div className="page-wrap text-center">
            <h2 className="font-serif text-4xl font-bold text-white mb-4">Ready to find what you lost?</h2>
            <p className="text-brand-100 text-lg mb-8 max-w-lg mx-auto">
              Join thousands who've already recovered their belongings through Findly.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/auth/register" className="btn bg-white text-brand-700 hover:bg-brand-50 btn-lg font-bold">Create Free Account</Link>
              <Link to="/items"         className="btn border-2 border-brand-400 text-white hover:bg-brand-600 btn-lg">Browse Items</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

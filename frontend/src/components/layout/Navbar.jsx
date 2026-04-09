import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLogout = async () => { setDropOpen(false); setMenuOpen(false); await logout(); navigate('/'); };

  const navCls = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-150 px-1 py-0.5 rounded ${isActive ? 'text-brand-700' : 'text-gray-600 hover:text-gray-900'}`;

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="page-wrap">
        <div className="h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" strokeWidth="2.5" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-serif text-xl font-bold text-gray-900">Findly</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            <NavLink to="/"      className={navCls} end>Home</NavLink>
            <NavLink to="/items" className={navCls}>Browse Items</NavLink>
            {isAuthenticated && <>
              <NavLink to="/dashboard"    className={navCls}>Dashboard</NavLink>
              <NavLink to="/my-items"     className={navCls}>My Items</NavLink>
              <NavLink to="/messages"     className={navCls}>Messages</NavLink>
              {user?.role === 'admin' && <NavLink to="/admin" className={navCls}>Admin</NavLink>}
            </>}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <Link to="/items/report" className="btn-primary btn-sm gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Report Item
                </Link>
                <div className="relative" ref={dropRef}>
                  <button onClick={() => setDropOpen((p) => !p)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <Avatar name={user?.name} src={user?.avatar} size="sm" />
                    <span className="text-sm font-semibold text-gray-800 hidden sm:block">{user?.name?.split(' ')[0]}</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 card shadow-xl animate-fade-in overflow-hidden z-50">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="font-semibold text-sm text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <span className="badge badge-active mt-1.5 capitalize">{user?.role}</span>
                      </div>
                      <div className="py-1">
                        {[
                          { to: '/dashboard', label: 'Dashboard' },
                          { to: '/my-items',  label: 'My Items' },
                          { to: '/messages',  label: 'Messages' },
                          { to: '/profile',   label: 'Profile' },
                          ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
                        ].map(({ to, label }) => (
                          <Link key={to} to={to} onClick={() => setDropOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-700 transition-colors">
                            {label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/auth/login"    className="btn-ghost btn-sm">Sign in</Link>
                <Link to="/auth/register" className="btn-primary btn-sm">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden btn-icon" onClick={() => setMenuOpen((p) => !p)} aria-label="Menu">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-0.5 animate-slide-up">
            {[
              { to: '/',           label: 'Home',         end: true },
              { to: '/items',      label: 'Browse Items' },
              ...(isAuthenticated ? [
                { to: '/items/report', label: '+ Report Item' },
                { to: '/dashboard',    label: 'Dashboard' },
                { to: '/my-items',     label: 'My Items' },
                { to: '/messages',     label: 'Messages' },
                { to: '/profile',      label: 'Profile' },
                ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
              ] : []),
            ].map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'}`
                }>
                {label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="flex gap-2 px-4 pt-2">
                <Link to="/auth/login"    className="btn-secondary flex-1 text-sm" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link to="/auth/register" className="btn-primary  flex-1 text-sm" onClick={() => setMenuOpen(false)}>Get started</Link>
              </div>
            )}
            {isAuthenticated && (
              <button onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                Sign out
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

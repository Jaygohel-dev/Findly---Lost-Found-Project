import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-gray-100 flex flex-col items-center justify-center px-4 py-12">
    <Link to="/" className="flex items-center gap-2.5 mb-8 group">
      <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-md group-hover:bg-brand-700 transition-colors">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" strokeWidth="2.5" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <span className="font-serif text-2xl font-bold text-gray-900">Findly</span>
    </Link>
    <div className="w-full max-w-md">
      <div className="card shadow-xl">
        <div className="card-body"><Outlet /></div>
      </div>
    </div>
    <p className="mt-8 text-xs text-gray-400">© {new Date().getFullYear()} Findly. All rights reserved.</p>
  </div>
);

export default AuthLayout;

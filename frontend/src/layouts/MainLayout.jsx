import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

const MainLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-1"><Outlet /></main>
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="page-wrap flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-600 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" strokeWidth="2.5" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-serif font-bold text-gray-900">Findly</span>
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Findly. Smart Lost & Found Platform.</p>
        <div className="flex gap-5">
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href="#" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  </div>
);

export default MainLayout;

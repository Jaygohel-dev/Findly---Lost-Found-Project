import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <p className="font-serif text-[120px] font-bold text-gray-100 leading-none select-none">404</p>
      <h1 className="text-3xl font-bold text-gray-900 -mt-4 mb-3">Page not found</h1>
      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn-primary">Go home</Link>
        <button onClick={() => window.history.back()} className="btn-secondary">Go back</button>
      </div>
    </div>
  );
}

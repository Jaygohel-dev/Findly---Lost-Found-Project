import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';
import MainLayout  from '@/layouts/MainLayout';
import AuthLayout  from '@/layouts/AuthLayout';

import Home        from '@/pages/Home';
import Login       from '@/pages/auth/Login';
import Register    from '@/pages/auth/Register';
import Browse      from '@/pages/items/Browse';
import ItemDetail  from '@/pages/items/ItemDetail';
import ReportItem  from '@/pages/items/ReportItem';
import Dashboard   from '@/pages/dashboard/Dashboard';
import MyItems     from '@/pages/dashboard/MyItems';
import Messages    from '@/pages/dashboard/Messages';
import Profile     from '@/pages/dashboard/Profile';
import AdminPanel  from '@/pages/admin/AdminPanel';
import NotFound    from '@/pages/NotFound';

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Loading />;
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Loading />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Auth layout */}
    <Route element={<AuthLayout />}>
      <Route path="/auth/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/auth/register" element={<PublicRoute><Register /></PublicRoute>} />
    </Route>

    {/* Main layout */}
    <Route element={<MainLayout />}>
      <Route path="/"            element={<Home />} />
      <Route path="/items"       element={<Browse />} />
      <Route path="/items/:id"   element={<ItemDetail />} />

      {/* Protected */}
      <Route path="/items/report" element={<ProtectedRoute><ReportItem /></ProtectedRoute>} />
      <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/my-items"     element={<ProtectedRoute><MyItems /></ProtectedRoute>} />
      <Route path="/messages"     element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

      {/* Redirects */}
      <Route path="/login"    element={<Navigate to="/auth/login"    replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;

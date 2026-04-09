import { cn } from '@/utils/helpers';
const V = {
  error:   { wrap: 'bg-red-50 border-red-200 text-red-800',     icon: '⚠' },
  success: { wrap: 'bg-green-50 border-green-200 text-green-800', icon: '✓' },
  info:    { wrap: 'bg-blue-50 border-blue-200 text-blue-800',   icon: 'ℹ' },
  warning: { wrap: 'bg-yellow-50 border-yellow-200 text-yellow-800', icon: '!' },
};
const Alert = ({ variant = 'error', message, className = '' }) => {
  if (!message) return null;
  const { wrap, icon } = V[variant] || V.error;
  return (
    <div role="alert" className={cn('flex items-start gap-3 p-3.5 rounded-xl border text-sm font-medium animate-fade-in', wrap, className)}>
      <span className="flex-shrink-0 mt-0.5">{icon}</span>
      <span>{message}</span>
    </div>
  );
};
export default Alert;

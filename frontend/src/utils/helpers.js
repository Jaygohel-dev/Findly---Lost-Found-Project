export const cn = (...cls) => cls.filter(Boolean).join(' ');

export const formatDate = (d, opts = {}) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', ...opts }).format(new Date(d));

export const timeAgo = (d) => {
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase()).join('');

export const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

export const truncate = (s = '', n = 80) => s.length > n ? s.slice(0, n) + '…' : s;

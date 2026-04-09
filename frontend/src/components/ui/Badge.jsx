import { cn } from '@/utils/helpers';
import { CAT_MAP, STATUS_META } from '@/utils/constants';

export const TypeBadge = ({ type }) => (
  <span className={cn('badge', type === 'lost' ? 'badge-lost' : 'badge-found')}>
    <span className={cn('w-1.5 h-1.5 rounded-full', type === 'lost' ? 'bg-red-500' : 'bg-green-500')} />
    {type === 'lost' ? 'Lost' : 'Found'}
  </span>
);

export const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || STATUS_META.active;
  return <span className={cn('badge', meta.cls)}>{meta.label}</span>;
};

export const CategoryBadge = ({ category }) => {
  const cat = CAT_MAP[category] || { icon: '📦', label: category };
  return (
    <span className="cat-pill">
      <span>{cat.icon}</span>
      <span className="capitalize">{cat.label}</span>
    </span>
  );
};

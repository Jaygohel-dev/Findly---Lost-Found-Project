import { getInitials, cn } from '@/utils/helpers';
const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
const Avatar = ({ name = '', src = '', size = 'md', className = '' }) => {
  if (src) return <img src={src} alt={name} className={cn('rounded-full object-cover flex-shrink-0', sizes[size], className)} />;
  return (
    <div className={cn('rounded-full bg-brand-600 text-white font-semibold flex items-center justify-center flex-shrink-0 select-none', sizes[size], className)}>
      {getInitials(name) || '?'}
    </div>
  );
};
export default Avatar;

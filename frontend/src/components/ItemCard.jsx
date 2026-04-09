import { Link } from 'react-router-dom';
import { CAT_MAP } from '@/utils/constants';
import { timeAgo } from '@/utils/helpers';
import { TypeBadge, StatusBadge } from '@/components/ui/Badge';

const ItemCard = ({ item }) => {
  const cat = CAT_MAP[item.category] || { icon: '📦', label: item.category };

  return (
    <Link to={`/items/${item._id}`} className="block group">
      <div className="card-hover h-full flex flex-col overflow-hidden">
        {/* Image */}
        <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex-shrink-0 overflow-hidden">
          {item.images?.length > 0 ? (
            <img src={item.images[0]} alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">{cat.icon}</div>
          )}
          <div className="absolute top-3 left-3"><TypeBadge type={item.type} /></div>
          {item.status !== 'active' && (
            <div className="absolute top-3 right-3"><StatusBadge status={item.status} /></div>
          )}
          {item.reward && (
            <div className="absolute bottom-3 right-3">
              <span className="badge bg-amber-100 text-amber-700">🎁 Reward</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <div className="flex items-center justify-between">
            <span className="cat-pill"><span>{cat.icon}</span><span>{cat.label}</span></span>
            <span className="text-xs text-gray-400">{timeAgo(item.createdAt)}</span>
          </div>

          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-700 transition-colors">
            {item.title}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 flex-1">{item.description}</p>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1 mt-auto border-t border-gray-50">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{item.location?.address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;

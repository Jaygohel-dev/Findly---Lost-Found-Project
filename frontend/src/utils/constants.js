export const CATEGORIES = [
  { value: 'electronics', label: 'Electronics', icon: '💻' },
  { value: 'wallet',      label: 'Wallet',      icon: '👛' },
  { value: 'keys',        label: 'Keys',        icon: '🔑' },
  { value: 'bag',         label: 'Bag',         icon: '🎒' },
  { value: 'documents',   label: 'Documents',   icon: '📋' },
  { value: 'jewelry',     label: 'Jewelry',     icon: '💍' },
  { value: 'clothing',    label: 'Clothing',    icon: '👕' },
  { value: 'pet',         label: 'Pet',         icon: '🐾' },
  { value: 'other',       label: 'Other',       icon: '📦' },
];

export const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

export const STATUS_META = {
  active:    { label: 'Active',    cls: 'badge-active' },
  matched:   { label: 'Matched',   cls: 'badge-matched' },
  recovered: { label: 'Recovered', cls: 'badge-recovered' },
  closed:    { label: 'Closed',    cls: 'badge-closed' },
};

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

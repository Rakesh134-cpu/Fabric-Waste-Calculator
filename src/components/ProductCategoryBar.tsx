import React from 'react';
import { LayoutGrid, Scissors, Sparkles, Heart } from 'lucide-react';

export interface CategoryItem {
  id: string;
  label: string;
  image?: string;
  icon?: React.ReactNode;
}

export const PRODUCT_CATEGORIES: CategoryItem[] = [
  {
    id: 'All',
    label: 'All',
    icon: <LayoutGrid className="w-5 h-5 text-white" />,
  },
  {
    id: 'Shirts',
    label: 'Shirts',
    image: '/assets/garments/shirt.png',
  },
  {
    id: 'T-Shirts',
    label: 'T-Shirts',
    image: '/assets/garments/kids-shirt.png',
  },
  {
    id: 'Pants',
    label: 'Pants',
    image: '/assets/garments/pants.png',
  },
  {
    id: 'Shorts',
    label: 'Shorts',
    image: '/assets/garments/shorts.png',
  },
  {
    id: 'Dresses',
    label: 'Dresses',
    image: '/assets/garments/dress.png',
  },
  {
    id: 'Accessories',
    label: 'Accessories',
    image: '/assets/garments/shirt.png', // fallback
    icon: (
      <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 10a6 6 0 0 1 12 0c0 4 2 6 2 6H4s2-2 2-6z" />
        <path d="M2 16h20" />
      </svg>
    ),
  },
  {
    id: 'Bags',
    label: 'Bags',
    icon: (
      <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: 'Home & Lifestyle',
    label: 'Home & Lifestyle',
    icon: (
      <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
        <path d="m14 9 3 3-3 3" />
      </svg>
    ),
  },
  {
    id: 'Pet Products',
    label: 'Pet Products',
    icon: (
      <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="4" r="2" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="20" cy="16" r="2" />
        <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
      </svg>
    ),
  },
];

interface ProductCategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
}

export const ProductCategoryBar: React.FC<ProductCategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      <div className="flex items-center gap-2.5 min-w-max">
        {PRODUCT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          if (cat.id === 'All') {
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center gap-1.5 h-[76px] min-w-[76px] px-3 rounded-2xl font-semibold text-xs transition-all shadow-sm ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-emerald-500/25 ring-2 ring-emerald-500 ring-offset-2'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                <div className="flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-white" />
                </div>
                <span>All</span>
              </button>
            );
          }

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center gap-1.5 h-[76px] min-w-[84px] px-3.5 rounded-2xl border transition-all shadow-sm ${
                isSelected
                  ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/30 text-emerald-800 font-semibold'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium'
              }`}
            >
              <div className="h-8 w-8 flex items-center justify-center">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="max-h-7 max-w-7 object-contain drop-shadow-sm"
                  />
                ) : (
                  <div className="text-slate-600 flex items-center justify-center">
                    {cat.icon}
                  </div>
                )}
              </div>
              <span className="text-[11px] leading-tight text-center tracking-tight text-slate-700">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCategoryBar;

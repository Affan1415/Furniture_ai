'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { ProductCategory } from '@/types';

interface CategoryFilterProps {
  categories: ProductCategory[];
  currentCategory?: string;
}

const categoryLabels: Record<ProductCategory, string> = {
  chair: 'Chairs',
  sofa: 'Sofas',
  table: 'Tables',
  bed: 'Beds',
  lamp: 'Lighting',
  storage: 'Storage',
};

export function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => handleCategoryChange(null)}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          !currentCategory
            ? 'bg-stone-900 text-white'
            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            currentCategory === category
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          )}
        >
          {categoryLabels[category]}
        </button>
      ))}
    </div>
  );
}

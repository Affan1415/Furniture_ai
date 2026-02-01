'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/products';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group"
    >
      <Link href={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-stone-100">
          <Image
            src={product.baseImage}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className={cn(
              'object-cover transition-transform duration-700 ease-out',
              'group-hover:scale-105'
            )}
            priority={priority}
          />

          {/* Overlay on hover */}
          <div
            className={cn(
              'absolute inset-0 bg-black/0 transition-colors duration-300',
              'group-hover:bg-black/5'
            )}
          />

          {/* Quick view button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className={cn(
              'absolute bottom-4 left-4 right-4',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center gap-2 py-3 px-4',
                'bg-white/95 backdrop-blur-sm rounded-md',
                'text-sm font-medium text-stone-900',
                'transform transition-transform duration-300',
                'group-hover:translate-y-0'
              )}
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Out of stock badge */}
          {!product.inStock && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 text-xs font-medium bg-stone-900 text-white rounded">
                Out of Stock
              </span>
            </div>
          )}

          {/* Featured badge */}
          {product.featured && product.inStock && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-900 rounded">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-1">
          {/* Category */}
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {product.category}
          </p>

          {/* Name */}
          <h3
            className={cn(
              'text-base font-medium text-stone-900',
              'group-hover:text-stone-600 transition-colors'
            )}
          >
            {product.name}
          </h3>

          {/* Price */}
          <p className="text-base text-stone-900 font-semibold">
            {formatPrice(product.price)}
          </p>

          {/* Material preview */}
          {product.material && (
            <p className="text-xs text-stone-500 line-clamp-1">{product.material}</p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

// Skeleton loader for ProductCard
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-lg bg-stone-200" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-16 bg-stone-200 rounded" />
        <div className="h-5 w-3/4 bg-stone-200 rounded" />
        <div className="h-5 w-1/4 bg-stone-200 rounded" />
      </div>
    </div>
  );
}

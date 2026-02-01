import { Suspense } from 'react';
import { ProductGrid, CategoryFilter, ProductCardSkeleton } from '@/components';
import { getProducts, getCategories, getFeaturedProducts } from '@/lib/products';
import type { ProductCategory } from '@/types';

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const category = params.category as ProductCategory | undefined;
  const categories = getCategories();
  const products = category
    ? getProducts({ category })
    : getProducts();

  const featuredProducts = getFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900">
              Modern Design,{' '}
              <span className="text-stone-500">Timeless Comfort</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 max-w-2xl">
              Discover furniture crafted for contemporary living. Explore every
              angle with our AI-powered visualization—see how each piece looks
              from any perspective before it arrives at your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="inline-flex items-center px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
              >
                Shop Collection
              </a>
              <a
                href="#featured"
                className="inline-flex items-center px-6 py-3 border border-stone-300 text-stone-700 font-medium rounded-lg hover:border-stone-400 hover:bg-white/50 transition-all"
              >
                View Featured
              </a>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-stone-200/50 to-transparent hidden lg:block" />
      </section>

      {/* Featured Products */}
      {!category && featuredProducts.length > 0 && (
        <section id="featured" className="py-16 lg:py-24 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold text-stone-900">
                  Featured Pieces
                </h2>
                <p className="mt-2 text-stone-600">
                  Curated selections from our latest collection
                </p>
              </div>
            </div>

            <Suspense
              fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <ProductGrid products={featuredProducts} columns={4} />
            </Suspense>
          </div>
        </section>
      )}

      {/* All Products */}
      <section id="products" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-stone-900">
                {category
                  ? `${category.charAt(0).toUpperCase() + category.slice(1)}s`
                  : 'All Products'}
              </h2>
              <p className="mt-2 text-stone-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <Suspense fallback={<div className="h-10" />}>
              <CategoryFilter
                categories={categories}
                currentCategory={category}
              />
            </Suspense>
          </div>

          {/* Products Grid */}
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <ProductGrid products={products} columns={4} />
          </Suspense>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-stone-900 to-stone-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                AI-Powered Visualization
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold">
                See Every Angle Before You Buy
              </h2>
              <p className="mt-4 text-stone-300 text-lg">
                Our AI generates photorealistic views of each product—front, side,
                angled, and in-room perspectives. Experience furniture like never
                before, from every angle, in any setting.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Multiple viewing angles generated instantly',
                  'Realistic in-room visualization',
                  'Material and texture accuracy preserved',
                  'High-resolution, photorealistic quality',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-stone-200">
                    <span className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-violet-400" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-stone-800 rounded-2xl overflow-hidden border border-stone-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                    <p className="text-stone-400">
                      Select a product to see AI views
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-violet-500/20 rounded-lg blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-500/20 rounded-lg blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-12 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10,000+', label: 'Happy Customers' },
              { value: '500+', label: 'Products' },
              { value: '100%', label: 'Sustainable Materials' },
              { value: '5 Year', label: 'Warranty' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl lg:text-3xl font-semibold text-stone-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-stone-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

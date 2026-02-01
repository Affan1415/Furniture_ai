import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Truck, RefreshCw, Shield } from 'lucide-react';
import { ImageGallery, ProductGrid } from '@/components';
import { getProduct, getRelatedProducts, formatPrice } from '@/lib/products';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.baseImage }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(id, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-stone-500 hover:text-stone-900 transition-colors"
          >
            Home
          </Link>
          <span className="text-stone-300">/</span>
          <Link
            href={`/?category=${product.category}`}
            className="text-stone-500 hover:text-stone-900 transition-colors capitalize"
          >
            {product.category}s
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-stone-900 font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="sticky top-24">
            <ImageGallery product={product} />
          </div>

          {/* Product Info */}
          <div className="lg:pt-4">
            {/* Back link (mobile) */}
            <Link
              href="/"
              className="lg:hidden inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to products
            </Link>

            {/* Category badge */}
            <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider text-stone-600 bg-stone-100 rounded-full mb-4">
              {product.category}
            </span>

            {/* Title & Price */}
            <h1 className="text-3xl lg:text-4xl font-semibold text-stone-900 tracking-tight">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl lg:text-3xl font-semibold text-stone-900">
              {formatPrice(product.price)}
            </p>

            {/* Description */}
            <p className="mt-6 text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="mt-8 space-y-4">
              {product.dimensions && (
                <div className="flex items-start gap-4">
                  <span className="w-24 text-sm font-medium text-stone-500">
                    Dimensions
                  </span>
                  <span className="text-sm text-stone-900">{product.dimensions}</span>
                </div>
              )}
              {product.material && (
                <div className="flex items-start gap-4">
                  <span className="w-24 text-sm font-medium text-stone-500">
                    Materials
                  </span>
                  <span className="text-sm text-stone-900">{product.material}</span>
                </div>
              )}
            </div>

            {/* Color options */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-stone-900 mb-3">
                  Available Colors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, i) => (
                    <button
                      key={color}
                      className={`px-4 py-2 text-sm border rounded-lg transition-all ${
                        i === 0
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="mt-8">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">In Stock</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-700">
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span className="text-sm font-medium">Currently Unavailable</span>
                </div>
              )}
            </div>

            {/* Add to cart */}
            <div className="mt-8 flex gap-4">
              <button
                disabled={!product.inStock}
                className="flex-1 py-4 px-6 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="py-4 px-6 border border-stone-200 rounded-lg hover:border-stone-300 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                  <Truck className="w-5 h-5 text-stone-600" />
                  <div>
                    <p className="text-sm font-medium text-stone-900">Free Shipping</p>
                    <p className="text-xs text-stone-500">On orders over $500</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-stone-600" />
                  <div>
                    <p className="text-sm font-medium text-stone-900">30-Day Returns</p>
                    <p className="text-xs text-stone-500">Hassle-free returns</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                  <Shield className="w-5 h-5 text-stone-600" />
                  <div>
                    <p className="text-sm font-medium text-stone-900">5-Year Warranty</p>
                    <p className="text-xs text-stone-500">Full coverage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Feature callout */}
            <div className="mt-8 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-stone-900">AI-Powered Views</p>
                  <p className="text-sm text-stone-600 mt-1">
                    Use the image gallery to explore this product from multiple angles.
                    Our AI generates photorealistic views so you can see exactly how it
                    looks from every perspective.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-stone-200">
            <h2 className="text-2xl font-semibold text-stone-900 mb-8">
              You May Also Like
            </h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </div>
    </div>
  );
}

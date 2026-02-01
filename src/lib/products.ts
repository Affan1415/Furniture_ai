import type { Product, ProductCategory, ProductFilters } from '@/types';

// Product catalog - in production, this would come from a database
// Using Unsplash images as placeholders for demonstration
const products: Product[] = [
  {
    id: 'oslo-lounge-chair',
    name: 'Oslo Lounge Chair',
    category: 'chair',
    baseImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=1000&fit=crop',
    description:
      'Scandinavian-inspired lounge chair with curved oak frame and premium wool upholstery. The organic silhouette provides exceptional comfort while making a bold design statement.',
    price: 1299,
    dimensions: 'W 76cm × D 82cm × H 77cm',
    material: 'Solid oak frame, wool blend upholstery',
    colors: ['Slate Grey', 'Oatmeal', 'Forest Green'],
    inStock: true,
    featured: true,
  },
  {
    id: 'como-sectional',
    name: 'Como Modular Sectional',
    category: 'sofa',
    baseImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop',
    description:
      'Modular sectional sofa with clean lines and deep seating. Configure to fit your space with left or right-facing chaise options. Premium down-blend cushions.',
    price: 4299,
    dimensions: 'W 295cm × D 175cm × H 82cm',
    material: 'Kiln-dried hardwood frame, performance linen',
    colors: ['Cloud White', 'Charcoal', 'Camel'],
    inStock: true,
    featured: true,
  },
  {
    id: 'nero-dining-table',
    name: 'Nero Dining Table',
    category: 'table',
    baseImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=1000&fit=crop',
    description:
      'Statement dining table featuring a solid walnut top with live edge detail. Sculptural steel base in matte black finish. Seats 6-8 comfortably.',
    price: 2499,
    dimensions: 'W 220cm × D 100cm × H 76cm',
    material: 'Solid American walnut, powder-coated steel',
    colors: ['Natural Walnut'],
    inStock: true,
    featured: true,
  },
  {
    id: 'haven-platform-bed',
    name: 'Haven Platform Bed',
    category: 'bed',
    baseImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=1000&fit=crop',
    description:
      'Low-profile platform bed with integrated headboard and floating nightstands. Japanese-inspired design with hidden storage drawers.',
    price: 3199,
    dimensions: 'W 193cm × D 228cm × H 95cm (King)',
    material: 'Solid white oak, natural oil finish',
    colors: ['Natural Oak', 'Ebonized Oak'],
    inStock: true,
    featured: false,
  },
  {
    id: 'arc-floor-lamp',
    name: 'Arc Floor Lamp',
    category: 'lamp',
    baseImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=1000&fit=crop',
    description:
      'Iconic arc floor lamp with adjustable height and swivel shade. Marble base provides stability while making an architectural statement.',
    price: 899,
    dimensions: 'Base: Ø 35cm, Height: 180-210cm, Reach: 120cm',
    material: 'Brushed brass, Carrara marble base, linen shade',
    colors: ['Brass/White', 'Black/Black'],
    inStock: true,
    featured: false,
  },
  {
    id: 'stack-bookshelf',
    name: 'Stack Modular Bookshelf',
    category: 'storage',
    baseImage: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=1000&fit=crop',
    description:
      'Geometric modular shelving system. Asymmetric design creates visual interest while providing ample storage. Can be wall-mounted or freestanding.',
    price: 1899,
    dimensions: 'W 180cm × D 35cm × H 200cm',
    material: 'Lacquered MDF, steel brackets',
    colors: ['Matte White', 'Matte Black', 'Oak Veneer'],
    inStock: false,
    featured: false,
  },
  {
    id: 'zen-accent-chair',
    name: 'Zen Accent Chair',
    category: 'chair',
    baseImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=1000&fit=crop',
    description:
      'Minimalist accent chair with woven rope seat and sculptural steel frame. Perfect as a statement piece or paired for intimate conversation.',
    price: 749,
    dimensions: 'W 58cm × D 62cm × H 75cm',
    material: 'Powder-coated steel, natural rope weave',
    colors: ['Black/Natural', 'White/Natural'],
    inStock: true,
    featured: false,
  },
  {
    id: 'drift-coffee-table',
    name: 'Drift Coffee Table',
    category: 'table',
    baseImage: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=1000&fit=crop',
    description:
      'Organic-shaped coffee table with tempered glass top and solid travertine base. The cloud-like silhouette adds softness to any living space.',
    price: 1599,
    dimensions: 'W 140cm × D 80cm × H 38cm',
    material: 'Tempered glass, honed travertine',
    colors: ['Clear/Natural Stone'],
    inStock: true,
    featured: true,
  },
  {
    id: 'nido-sofa',
    name: 'Nido Compact Sofa',
    category: 'sofa',
    baseImage: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=1000&fit=crop',
    description:
      'Apartment-sized sofa with generous proportions despite compact footprint. High-density foam core with feather-wrapped cushions for ultimate comfort.',
    price: 2199,
    dimensions: 'W 185cm × D 92cm × H 85cm',
    material: 'Solid beech frame, bouclé fabric',
    colors: ['Cream Bouclé', 'Graphite', 'Terracotta'],
    inStock: true,
    featured: false,
  },
  {
    id: 'mono-side-table',
    name: 'Mono Side Table',
    category: 'table',
    baseImage: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&h=1000&fit=crop',
    description:
      'Sculptural side table carved from a single block of concrete. Each piece is unique with subtle variations in texture and tone.',
    price: 449,
    dimensions: 'Ø 40cm × H 52cm',
    material: 'Cast concrete, cork bottom',
    colors: ['Natural Grey', 'Charcoal'],
    inStock: true,
    featured: false,
  },
  {
    id: 'dream-bed-frame',
    name: 'Dream Upholstered Bed',
    category: 'bed',
    baseImage: 'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=800&h=1000&fit=crop',
    description:
      'Fully upholstered bed frame with curved headboard and padded rails. Channel-tufted velvet adds luxury texture.',
    price: 2799,
    dimensions: 'W 183cm × D 223cm × H 120cm (Queen)',
    material: 'Engineered wood frame, performance velvet',
    colors: ['Dusty Rose', 'Midnight Blue', 'Sage'],
    inStock: true,
    featured: false,
  },
  {
    id: 'form-pendant',
    name: 'Form Pendant Light',
    category: 'lamp',
    baseImage: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=1000&fit=crop',
    description:
      'Hand-blown glass pendant with organic, asymmetric form. Warm ambient glow through frosted interior. Ideal over dining tables or kitchen islands.',
    price: 599,
    dimensions: 'Ø 45cm × H 55cm, Cord: 200cm adjustable',
    material: 'Hand-blown glass, brass hardware',
    colors: ['Smoke', 'Amber', 'Clear'],
    inStock: true,
    featured: false,
  },
];

/**
 * Get all products with optional filtering
 */
export function getProducts(filters?: ProductFilters): Product[] {
  let filtered = [...products];

  if (filters?.category) {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters?.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter((p) => p.price >= min && p.price <= max);
  }

  if (filters?.materials?.length) {
    filtered = filtered.filter((p) =>
      filters.materials!.some((m) => p.material?.toLowerCase().includes(m.toLowerCase()))
    );
  }

  if (filters?.inStock !== undefined) {
    filtered = filtered.filter((p) => p.inStock === filters.inStock);
  }

  return filtered;
}

/**
 * Get a single product by ID
 */
export function getProduct(id: string): Product | null {
  return products.find((p) => p.id === id) || null;
}

/**
 * Get featured products
 */
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

/**
 * Get all unique categories
 */
export function getCategories(): ProductCategory[] {
  const categories = new Set(products.map((p) => p.category));
  return Array.from(categories) as ProductCategory[];
}

/**
 * Get related products (same category, excluding current)
 */
export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const product = getProduct(productId);
  if (!product) return [];

  return products
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}

/**
 * Search products by name or description
 */
export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.material?.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get price range for filters
 */
export function getPriceRange(): [number, number] {
  const prices = products.map((p) => p.price);
  return [Math.min(...prices), Math.max(...prices)];
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

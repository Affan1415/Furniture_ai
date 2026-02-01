// Product Types
export type ProductCategory = 'chair' | 'sofa' | 'table' | 'bed' | 'lamp' | 'storage';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  baseImage: string;
  description: string;
  price: number;
  dimensions?: string;
  material?: string;
  colors?: string[];
  inStock?: boolean;
  featured?: boolean;
}

// AI View Generation Types
export type ViewType =
  | 'front'
  | 'side'
  | 'angle-45'
  | 'in-room'
  | 'detail'
  | 'top';

export interface ViewConfig {
  type: ViewType;
  label: string;
  description: string;
  promptModifier: string;
}

export interface GeneratedView {
  viewType: ViewType;
  imageUrl: string;
  generatedAt: Date;
  cached: boolean;
}

export interface AIGenerationRequest {
  product: Product;
  viewType: ViewType;
  options?: AIGenerationOptions;
}

export interface AIGenerationOptions {
  lighting?: 'studio' | 'natural' | 'dramatic' | 'soft';
  background?: 'minimal' | 'white' | 'room' | 'lifestyle';
  quality?: 'standard' | 'high' | 'ultra';
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:4';
}

export interface AIGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    model: string;
    generationTime: number;
    promptUsed: string;
  };
}

// UI State Types
export interface GalleryState {
  currentView: ViewType;
  views: GeneratedView[];
  isLoading: boolean;
  error: string | null;
}

// Filter Types
export interface ProductFilters {
  category?: ProductCategory;
  priceRange?: [number, number];
  materials?: string[];
  inStock?: boolean;
}

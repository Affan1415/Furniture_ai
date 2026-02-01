'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Loader2,
  Sparkles,
  RotateCw,
} from 'lucide-react';
import type { Product, ViewType, GeneratedView } from '@/types';
import { VIEW_CONFIGS } from '@/lib/ai';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  product: Product;
  initialViews?: GeneratedView[];
}

// Available view types for the gallery
const AVAILABLE_VIEWS: ViewType[] = ['front', 'side', 'angle-45', 'in-room'];

export function ImageGallery({ product, initialViews = [] }: ImageGalleryProps) {
  const [currentView, setCurrentView] = useState<ViewType>('front');
  const [views, setViews] = useState<Map<ViewType, GeneratedView>>(() => {
    const map = new Map<ViewType, GeneratedView>();
    // Initialize with base image for all views
    AVAILABLE_VIEWS.forEach((viewType) => {
      const existing = initialViews.find((v) => v.viewType === viewType);
      map.set(viewType, existing || {
        viewType,
        imageUrl: product.baseImage,
        generatedAt: new Date(),
        cached: true,
      });
    });
    return map;
  });
  const [isGenerating, setIsGenerating] = useState<ViewType | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Current view data
  const currentViewData = views.get(currentView);
  const currentImage = currentViewData?.imageUrl || product.baseImage;

  // Handle AI view generation
  const handleGenerateView = useCallback(async (viewType: ViewType) => {
    if (isGenerating) return;

    setIsGenerating(viewType);

    try {
      // Call the API route for view generation
      const response = await fetch('/api/generate-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          viewType,
        }),
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        setViews((prev) => {
          const newMap = new Map(prev);
          newMap.set(viewType, {
            viewType,
            imageUrl: data.imageUrl,
            generatedAt: new Date(),
            cached: false,
          });
          return newMap;
        });
      }
    } catch (error) {
      console.error('Failed to generate view:', error);
    } finally {
      setIsGenerating(null);
    }
  }, [isGenerating, product.id]);

  // Handle zoom mouse tracking
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    },
    [isZoomed]
  );

  // Navigate between views
  const navigateView = useCallback(
    (direction: 'prev' | 'next') => {
      const currentIndex = AVAILABLE_VIEWS.indexOf(currentView);
      let newIndex: number;

      if (direction === 'prev') {
        newIndex = currentIndex === 0 ? AVAILABLE_VIEWS.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex === AVAILABLE_VIEWS.length - 1 ? 0 : currentIndex + 1;
      }

      setCurrentView(AVAILABLE_VIEWS[newIndex]);
    },
    [currentView]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigateView('prev');
      if (e.key === 'ArrowRight') navigateView('next');
      if (e.key === 'Escape') setIsZoomed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateView]);

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative">
        <motion.div
          className={cn(
            'relative aspect-square overflow-hidden rounded-xl bg-stone-100',
            'cursor-zoom-in',
            isZoomed && 'cursor-zoom-out'
          )}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImage}
                alt={`${product.name} - ${VIEW_CONFIGS[currentView].label}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={cn(
                  'object-cover transition-transform duration-300',
                  isZoomed && 'scale-150'
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      }
                    : undefined
                }
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Loading overlay */}
          {isGenerating === currentView && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-stone-600" />
                <span className="text-sm font-medium text-stone-600">
                  Generating {VIEW_CONFIGS[currentView].label}...
                </span>
              </div>
            </div>
          )}

          {/* Navigation arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateView('prev');
            }}
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2',
              'w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm',
              'flex items-center justify-center',
              'hover:bg-white transition-colors',
              'shadow-sm'
            )}
            aria-label="Previous view"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateView('next');
            }}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm',
              'flex items-center justify-center',
              'hover:bg-white transition-colors',
              'shadow-sm'
            )}
            aria-label="Next view"
          >
            <ChevronRight className="w-5 h-5 text-stone-700" />
          </button>

          {/* Zoom indicator */}
          <div
            className={cn(
              'absolute top-3 right-3',
              'px-2 py-1 rounded bg-white/90 backdrop-blur-sm',
              'flex items-center gap-1.5 text-xs text-stone-600'
            )}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Click to zoom</span>
          </div>

          {/* View label */}
          <div
            className={cn(
              'absolute bottom-3 left-3',
              'px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm',
              'text-sm font-medium text-stone-800'
            )}
          >
            {VIEW_CONFIGS[currentView].label}
          </div>
        </motion.div>
      </div>

      {/* View Toggle Buttons */}
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_VIEWS.map((viewType) => {
          const config = VIEW_CONFIGS[viewType];
          const isActive = currentView === viewType;
          const isLoading = isGenerating === viewType;
          const viewData = views.get(viewType);
          const isGenerated = viewData && !viewData.cached;

          return (
            <button
              key={viewType}
              onClick={() => setCurrentView(viewType)}
              disabled={isLoading}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg',
                'text-sm font-medium transition-all duration-200',
                'border',
                isActive
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isGenerated ? (
                <Sparkles className="w-4 h-4 text-amber-500" />
              ) : null}
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Generate AI View Button */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => handleGenerateView(currentView)}
          disabled={isGenerating !== null}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg',
            'bg-gradient-to-r from-violet-600 to-indigo-600',
            'text-white text-sm font-medium',
            'hover:from-violet-700 hover:to-indigo-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'shadow-sm hover:shadow-md'
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate AI View</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleGenerateView(currentView)}
          disabled={isGenerating !== null}
          className={cn(
            'flex items-center gap-2 px-3 py-2.5 rounded-lg',
            'border border-stone-200 text-stone-600',
            'hover:bg-stone-50 hover:border-stone-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
          title="Regenerate view"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 pt-2">
        {AVAILABLE_VIEWS.map((viewType) => {
          const isActive = currentView === viewType;
          const viewData = views.get(viewType);
          const imageUrl = viewData?.imageUrl || product.baseImage;

          return (
            <button
              key={viewType}
              onClick={() => setCurrentView(viewType)}
              className={cn(
                'relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden',
                'border-2 transition-all duration-200',
                isActive
                  ? 'border-stone-900 ring-2 ring-stone-900/20'
                  : 'border-transparent hover:border-stone-300'
              )}
            >
              <Image
                src={imageUrl}
                alt={`${product.name} - ${VIEW_CONFIGS[viewType].label} thumbnail`}
                fill
                sizes="80px"
                className="object-cover"
              />
              {isGenerating === viewType && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

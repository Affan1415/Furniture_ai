'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Loader2, Sparkles, Check } from 'lucide-react';
import { getProducts } from '@/lib/products';
import type { Product } from '@/types';

const ACCEPT =
  'image/jpeg,image/png,image/webp,image/heic,image/heif';
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

async function ensureJpegOrPng(file: File): Promise<File> {
  const type = (file.type || '').toLowerCase();
  if (type === 'image/heic' || type === 'image/heif') {
    const heic2any = (await import('heic2any')).default;
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
    const b = Array.isArray(blob) ? blob[0] : blob;
    const name = file.name.replace(/\.[^.]+$/i, '.jpg');
    return new File([b], name, { type: 'image/jpeg' });
  }
  return file;
}

const products = getProducts();

export function PlaceInRoomForm() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [roomFile, setRoomFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ dataUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const roomInputRef = useRef<HTMLInputElement>(null);

  const handleRoomChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !ALLOWED_TYPES.includes((file.type || '').toLowerCase())) {
      setError('Please choose a JPEG, PNG, WebP or HEIC image (e.g. from your phone).');
      return;
    }
    setConverting(true);
    setError(null);
    setResult(null);
    try {
      const converted = await ensureJpegOrPng(file);
      setRoomFile(converted);
    } catch {
      setError('Could not use this image. Try JPEG or PNG.');
    } finally {
      setConverting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !roomFile) {
      setError('Please select a furniture piece and upload a room image.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('furnitureProductId', selectedProduct.id);
      formData.append('roomImage', roomFile);
      const res = await fetch('/api/visualize-furniture', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Generation failed');
      }
      if (!data.success) {
        throw new Error(data.error ?? 'No image returned');
      }
      const dataUrl = data.dataUrl ?? (data.url ? data.url : null);
      if (!dataUrl) throw new Error(data.error ?? 'No image returned');
      setResult({ dataUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedProduct(null);
    setRoomFile(null);
    setResult(null);
    setError(null);
    if (roomInputRef.current) roomInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Furniture selection from app products */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Choose furniture
            </label>
            <p className="text-xs text-stone-500 mb-3">
              Select one piece from our collection to place in your room.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1 border border-stone-200 rounded-xl p-2 bg-stone-50/50">
              {products.map((product) => {
                const isSelected = selectedProduct?.id === product.id;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(product);
                      setError(null);
                      setResult(null);
                    }}
                    className={`
                      relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                      focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2
                      ${isSelected ? 'border-stone-900 ring-2 ring-stone-900 ring-offset-2' : 'border-stone-200 hover:border-stone-400'}
                    `}
                  >
                    <Image
                      src={product.baseImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, 20vw"
                    />
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center bg-stone-900/30">
                        <span className="rounded-full bg-stone-900 p-1.5">
                          <Check className="w-4 h-4 text-white" />
                        </span>
                      </span>
                    )}
                    <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 py-1 text-[10px] font-medium text-white truncate">
                      {product.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room image */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Room or space image
            </label>
            <div
              onClick={() => roomInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-colors min-h-[200px] flex flex-col items-center justify-center
                ${roomFile ? 'border-stone-400 bg-stone-50' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50/50'}
              `}
            >
              <input
                ref={roomInputRef}
                type="file"
                accept={ACCEPT}
                onChange={handleRoomChange}
                className="hidden"
              />
              {roomFile ? (
                <>
                  <ImageIcon className="w-12 h-12 text-stone-500 mb-2" />
                  <p className="text-sm font-medium text-stone-700 truncate max-w-full px-2">
                    {roomFile.name}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Click to change
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-stone-400 mb-2" />
                  <p className="text-sm text-stone-600">Click to upload</p>
                  <p className="text-xs text-stone-500 mt-1">JPEG, PNG, WebP or HEIC (e.g. from phone)</p>
                </>
              )}
            </div>
          </div>
        </div>

        {converting && (
          <p className="text-sm text-stone-500">Converting image…</p>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading || converting || !selectedProduct || !roomFile}
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Place furniture in room
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 text-stone-700 font-medium rounded-lg hover:border-stone-400 hover:bg-stone-50 disabled:opacity-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-10 pt-10 border-t border-stone-200">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">Result (1024×1024)</h3>
          <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-100 inline-block">
            <img
              src={result.dataUrl}
              alt="Furniture placed in room"
              className="w-full max-w-[1024px] h-auto block"
            />
          </div>
        </div>
      )}
    </div>
  );
}

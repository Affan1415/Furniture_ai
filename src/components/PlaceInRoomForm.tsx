'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';

export function PlaceInRoomForm() {
  const [furnitureFile, setFurnitureFile] = useState<File | null>(null);
  const [roomFile, setRoomFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ dataUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const furnitureInputRef = useRef<HTMLInputElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);

  const handleFurnitureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setFurnitureFile(file);
      setError(null);
      setResult(null);
    }
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setRoomFile(file);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!furnitureFile || !roomFile) {
      setError('Please upload both a furniture image and a room image.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('furnitureImage', furnitureFile);
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
    setFurnitureFile(null);
    setRoomFile(null);
    setResult(null);
    setError(null);
    if (furnitureInputRef.current) furnitureInputRef.current.value = '';
    if (roomInputRef.current) roomInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Furniture image */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Furniture image
            </label>
            <div
              onClick={() => furnitureInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-colors min-h-[200px] flex flex-col items-center justify-center
                ${furnitureFile ? 'border-stone-400 bg-stone-50' : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50/50'}
              `}
            >
              <input
                ref={furnitureInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFurnitureChange}
                className="hidden"
              />
              {furnitureFile ? (
                <>
                  <ImageIcon className="w-12 h-12 text-stone-500 mb-2" />
                  <p className="text-sm font-medium text-stone-700 truncate max-w-full px-2">
                    {furnitureFile.name}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Click to change
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-stone-400 mb-2" />
                  <p className="text-sm text-stone-600">Click to upload</p>
                  <p className="text-xs text-stone-500 mt-1">JPEG, PNG or WebP</p>
                </>
              )}
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
                accept="image/jpeg,image/png,image/webp"
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
                  <p className="text-xs text-stone-500 mt-1">JPEG, PNG or WebP</p>
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading || !furnitureFile || !roomFile}
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

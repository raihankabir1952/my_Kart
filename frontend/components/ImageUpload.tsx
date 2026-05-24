'use client';

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (value.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5 MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onChange([...value, res.data.url]);
      toast.success('Image uploaded!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Images ({value.length}/{maxImages})
      </label>

      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, idx) => (
          <div
            key={idx}
            className="group relative aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-orange-600 px-1.5 py-0.5 text-xs font-medium text-white">
                Main
              </span>
            )}
          </div>
        ))}

        {value.length < maxImages && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-orange-500 hover:bg-orange-50">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="mt-1 text-xs text-gray-500">Upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Max 5 MB per image. First image will be the main display.
      </p>
    </div>
  );
}
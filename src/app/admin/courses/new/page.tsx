'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: '',
    level: 'Básico' as 'Básico' | 'Intermedio' | 'Pro',
    videoFile: null as File | null,
  });
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'video/mp4') {
        setError('Solo se permiten archivos MP4');
        return;
      }
      if (file.size > 1073741824) {
        setError('El archivo no puede ser mayor a 1GB');
        return;
      }
      setFormData({ ...formData, videoFile: file });
      setError(null);
    }
  };

  const handleUploadVideo = async () => {
    if (!formData.videoFile) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Primero crear el curso para obtener el ID
      const courseResponse = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title || 'Temporal',
          description: formData.description || 'Temporal',
          price: formData.price || 0,
          thumbnail: formData.thumbnail || '',
          level: formData.level,
        }),
      });

      if (!courseResponse.ok) {
        throw new Error('Error al crear el curso');
      }

      const { course } = await courseResponse.json();
      const courseId = course.id;

      // Obtener presigned URL
      const presignedResponse = await fetch('/api/admin/upload/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          filename: formData.videoFile.name,
          contentType: formData.videoFile.type,
        }),
      });

      if (!presignedResponse.ok) {
        throw new Error('Error al obtener URL de subida');
      }

      const { url, key } = await presignedResponse.json();
      setVideoKey(key);

      // Subir archivo directamente a S3 con progreso
      const xhr = new XMLHttpRequest();
      
      return new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadProgress(Math.round(percentComplete));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error('Error al subir el video'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Error de red al subir el video'));
        });

        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', formData.videoFile.type);
        xhr.send(formData.videoFile);
      }).then(() => {

      // Actualizar el curso con el videoKey
      await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...course,
          videoKey: key,
        }),
      });

        setUploadProgress(100);
        router.push('/admin');
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.videoFile) {
        // Crear curso sin video
        const response = await fetch('/api/admin/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            price: Number(formData.price),
            thumbnail: formData.thumbnail,
            level: formData.level,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al crear el curso');
        }

        router.push('/admin');
      } else {
        // Si hay video, se sube primero
        await handleUploadVideo();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors uppercase text-sm font-bold tracking-tighter"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Panel
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black uppercase italic mb-8">
          Nuevo Curso
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-tighter mb-2">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
              placeholder="EL CAMINO A LA PLANCHE"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-tighter mb-2">
              Descripción *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors resize-none"
              placeholder="Desde lean hollow body hasta Full Planche..."
            />
          </div>

          {/* Precio y Nivel */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-tighter mb-2">
                Precio (CLP) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
                placeholder="45000"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-tighter mb-2">
                Nivel *
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
              >
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Pro">Pro</option>
              </select>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-tighter mb-2">
              URL Thumbnail
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 px-4 py-3 focus:border-yellow-500 focus:outline-none transition-colors"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-tighter mb-2">
              Video (MP4) *
            </label>
            <div className="border-2 border-dashed border-zinc-800 p-6 bg-zinc-900/50">
              <input
                type="file"
                accept="video/mp4"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
                required
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-4"
              >
                <Upload className="w-12 h-12 text-zinc-600" />
                <div className="text-center">
                  <span className="text-yellow-500 font-bold uppercase text-sm">
                    Click para seleccionar
                  </span>
                  <p className="text-zinc-500 text-xs mt-1">
                    {formData.videoFile
                      ? formData.videoFile.name
                      : 'Archivo MP4 (máx. 1GB)'}
                  </p>
                </div>
              </label>

              {uploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-tighter text-zinc-400">
                      Subiendo...
                    </span>
                    <span className="text-xs font-bold text-yellow-500">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2">
                    <div
                      className="bg-yellow-500 h-2 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 p-4 text-red-500 text-sm uppercase tracking-tighter">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-yellow-500 text-black px-8 py-4 text-sm font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(loading || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {uploading ? 'Subiendo...' : 'Crear Curso'}
            </button>
            <Link
              href="/admin"
              className="bg-zinc-800 text-white px-8 py-4 text-sm font-black uppercase tracking-tighter hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

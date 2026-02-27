'use client';

import { Lock, Play } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoUrl?: string;
  hasAccess: boolean;
  courseId: string;
  coursePrice: number;
}

export function VideoPlayer({ videoUrl, hasAccess, courseId, coursePrice }: VideoPlayerProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasAccess && courseId) {
      setLoading(true);
      fetch(`/api/videos/${courseId}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Failed to load video');
        })
        .then((data) => {
          setStreamUrl(data.url);
        })
        .catch((error) => {
          console.error('Error loading video:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [hasAccess, courseId]);

  if (!hasAccess) {
    return (
      <div className="relative w-full aspect-video bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
        {/* Blurred/Blocked Video Preview */}
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <div className="absolute inset-0 opacity-20">
            {videoUrl ? (
              <iframe
                src={videoUrl}
                className="w-full h-full pointer-events-none blur-sm"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                <Play className="w-24 h-24 text-zinc-700" />
              </div>
            )}
          </div>
        </div>

        {/* Overlay de Bloqueo */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 border-4 border-yellow-500/50">
          <div className="text-center px-6">
            <div className="mb-6 flex justify-center">
              <div className="bg-yellow-500/20 border-2 border-yellow-500 p-6 rounded-sm">
                <Lock className="w-12 h-12 text-yellow-500" />
              </div>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-4 text-white">
              Contenido Bloqueado
            </h3>
            
            <p className="text-zinc-400 mb-8 max-w-md text-sm uppercase tracking-wider">
              Adquiere este curso para desbloquear todo el contenido premium
            </p>

            <Link
              href={`/checkout?course=${courseId}`}
              className="inline-block bg-yellow-500 text-black px-8 py-4 text-sm font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-white"
            >
              Comprar Ahora - ${coursePrice.toLocaleString('es-CL')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Usuario tiene acceso - mostrar video completo
  return (
    <div className="w-full aspect-video bg-zinc-900 border border-yellow-500 rounded-sm overflow-hidden">
      {loading ? (
        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <div className="text-center">
            <Play className="w-24 h-24 text-yellow-500 mx-auto mb-4 animate-pulse" />
            <p className="text-zinc-400 uppercase tracking-wider text-sm">Cargando video...</p>
          </div>
        </div>
      ) : streamUrl ? (
        <video
          src={streamUrl}
          controls
          className="w-full h-full"
          controlsList="nodownload"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
          <div className="text-center">
            <Play className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
            <p className="text-zinc-400 uppercase tracking-wider text-sm">Video no disponible</p>
          </div>
        </div>
      )}
    </div>
  );
}

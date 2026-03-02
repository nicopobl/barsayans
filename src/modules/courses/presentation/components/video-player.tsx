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
      <div className="relative w-full aspect-video bg-black border border-zinc-900 rounded-sm overflow-hidden">
        {/* Blurred/Blocked Video Preview */}
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="absolute inset-0 opacity-30 grayscale contrast-125">
            {videoUrl ? (
              <iframe
                src={videoUrl}
                className="w-full h-full pointer-events-none blur-md scale-110"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center">
                <Play className="w-24 h-24 text-zinc-800" />
              </div>
            )}
          </div>
          {/* Dark to Yellow Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-brand-accent/20" />
        </div>

        {/* Overlay de Bloqueo Premium */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 border-2 border-brand-accent/30">
          <div className="text-center px-8 max-w-2xl">
            <div className="mb-8 flex justify-center">
              <div className="bg-brand-accent/10 border-2 border-brand-accent p-8 rounded-sm backdrop-blur-sm">
                <Lock className="w-16 h-16 text-brand-accent" />
              </div>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black uppercase italic mb-6 text-white tracking-tighter leading-tight">
              CONTENIDO EXCLUSIVO BARSAYANS
            </h3>
            
            <p className="text-zinc-300 mb-10 text-base uppercase tracking-wider leading-relaxed">
              Este video es solo para miembros premium.<br />
              Adquiere el curso para desbloquearlo.
            </p>

            <Link
              href={`/checkout?course=${courseId}`}
              className="inline-block bg-brand-accent text-black px-10 py-5 text-sm font-black uppercase tracking-tighter hover:bg-brand-accent/90 transition-all duration-300 border-2 border-brand-accent hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] relative overflow-hidden group"
            >
              <span className="relative z-10">ADQUIRIR ACCESO</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Usuario tiene acceso - mostrar video completo
  return (
    <div className="w-full aspect-video bg-black border-2 border-brand-accent rounded-sm overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.2)]">
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

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('course');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('No se especificó un curso');
      setLoading(false);
      return;
    }

    const createCheckout = async () => {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ courseId }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error al crear la sesión de pago');
        }

        const { url } = await response.json();
        
        if (url) {
          // Redirigir a Mercado Pago Checkout
          window.location.href = url;
        } else {
          throw new Error('No se recibió URL de checkout');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    createCheckout();
  }, [courseId]);

  if (error) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-black uppercase italic mb-4 text-red-500">
            Error
          </h1>
          <p className="text-zinc-400 mb-8">{error}</p>
          <Link
            href={courseId ? `/courses/${courseId}` : '/'}
            className="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-4 text-sm font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <div className="text-center px-6">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-black uppercase italic mb-2">
          Redirigiendo a Mercado Pago...
        </h1>
        <p className="text-zinc-400 text-sm">
          Por favor espera mientras procesamos tu pago
        </p>
      </div>
    </main>
  );
}

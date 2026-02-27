import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <div className="text-center px-6">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-500/20 border-2 border-red-500 p-6 rounded-sm">
            <ShieldX className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-4">
          Acceso Denegado
        </h1>
        
        <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm uppercase tracking-wider">
          No tienes permisos para acceder a esta sección
        </p>

        <Link
          href="/"
          className="inline-block bg-yellow-500 text-black px-8 py-4 text-sm font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-white"
        >
          Volver al Inicio
        </Link>
      </div>
    </main>
  );
}

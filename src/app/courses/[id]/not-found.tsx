import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function CourseNotFound() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <div className="text-center px-6">
        <div className="mb-6 flex justify-center">
          <div className="bg-yellow-500/20 border-2 border-yellow-500 p-6 rounded-sm">
            <AlertCircle className="w-12 h-12 text-yellow-500" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-4">
          Curso No Encontrado
        </h1>
        
        <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm uppercase tracking-wider">
          El curso que buscas no existe o ha sido eliminado
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-4 text-sm font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Cursos
        </Link>
      </div>
    </main>
  );
}

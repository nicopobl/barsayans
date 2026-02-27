'use client';

import { signIn } from 'next-auth/react';
import { Dumbbell } from 'lucide-react';

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 border-2 border-yellow-500 rounded-sm mb-6">
            <Dumbbell className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-black uppercase italic mb-4">
            Barsayans<span className="text-yellow-500">.</span>Academy
          </h1>
          <p className="text-zinc-400 uppercase tracking-wider text-sm">
            Inicia sesión para continuar
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-sm">
          <button
            onClick={() => signIn('cognito', { callbackUrl: '/' })}
            className="w-full bg-yellow-500 text-black px-6 py-4 text-sm font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-white"
          >
            Iniciar Sesión con Google
          </button>
        </div>
      </div>
    </main>
  );
}

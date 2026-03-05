import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

/**
 * Top navigation for public (marketing) pages.
 * Sticky, transparent-to-black on scroll.
 */
export function MarketingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand-zinc-800/50 bg-brand-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white hover:text-brand-accent-400 transition-colors"
        >
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/#courses"
            className="text-sm text-brand-zinc-400 hover:text-white transition-colors"
          >
            Cursos
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-black hover:bg-brand-accent-400 transition-colors"
          >
            Ingresar
          </Link>
        </div>
      </nav>
    </header>
  );
}

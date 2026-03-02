import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    
    // Verificar acceso de admin para rutas /admin
    if (path.startsWith('/admin')) {
      const token = req.nextauth.token;
      const adminEmails = (process.env.ADMIN_EMAILS?.split(',') || []).map(email => email.trim().toLowerCase());
      const userEmail = ((token?.email as string) || '').toLowerCase();
      
      // Verificar si el usuario es admin por email o por rol
      const isAdmin = 
        adminEmails.includes(userEmail) || 
        (token?.role === 'admin');
      
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/auth/unauthorized', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Proteger rutas /courses y /checkout
        if (path.startsWith('/courses') || path.startsWith('/checkout')) {
          return !!token;
        }
        
        // Proteger rutas /admin (la verificación de admin se hace en el middleware)
        if (path.startsWith('/admin')) {
          return !!token;
        }
        
        return true;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    '/courses/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    // Nota: /api/auth está explícitamente excluido del matcher
    // para permitir que NextAuth maneje las rutas de autenticación sin interferencia
    // Nota: /api/webhooks está explícitamente excluido del matcher
    // para permitir que los webhooks de Mercado Pago (incluyendo desde ngrok) funcionen sin autenticación
  ],
};

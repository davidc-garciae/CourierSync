import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Verificar si hay tokens de sesión en las cookies o headers
    const hasUserType = request.cookies.get('userType')?.value || 
                       request.headers.get('x-user-type');
    const hasAuthentication = request.cookies.get('isAuthenticated')?.value || 
                             request.headers.get('x-authenticated');

    // Si no hay autenticación, redirigir al login
    if (!hasAuthentication || hasAuthentication !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Verificar permisos por tipo de ruta
    if (pathname.startsWith('/dashboard') && hasUserType !== 'cliente') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (pathname.startsWith('/admin') && hasUserType !== 'agente') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 
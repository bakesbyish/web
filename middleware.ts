import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Get the current URL
  const url = req.nextUrl.clone();

  // Get the user session
  const session = req.cookies.get('__session') || null;
  const maintenance = false;

  // Block the site if the site is in maintainance
  if (maintenance) {
    url.pathname = `/maintenance`;
  }

  // Handle collections with no page number
  if (url.pathname.startsWith('/collections/')) {
    if (url.pathname.split('/').length === 3) {
      const collection = url.pathname.split('/')[2];
      url.pathname = `/collections/${collection}/1`;
    }
  }

  // Make profile page unavailable for unauthenticated users
  if (url.pathname.startsWith('/profile')) {
    if (!session) {
      url.pathname = '/register';
    }
  }

  // Make orders page unavailable for unauthenticated users
  if (url.pathname.startsWith('/orders')) {
    if (!session) {
      url.pathname = '/register';
    }
  }

  // Make the login page and register page unavailable for unauthenticated users
  if (
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/register')
  ) {
    if (session) {
      url.pathname = '/';
    }
  }

  // Disable the maintenance page when there is not maintainance
  if (url.pathname.startsWith('/maintenance') && !maintenance) {
    url.pathname = '/';
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/collections/:path/:path*', '/profile', '/login', '/register'],
};

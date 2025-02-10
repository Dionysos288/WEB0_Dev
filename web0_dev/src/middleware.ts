import { betterFetch } from '@better-fetch/fetch';
import { NextResponse, type NextRequest } from 'next/server';
import { Session } from '@/lib/auth';

const authRoutes = ['/sign-in', '/sign-up'];
const passwordRoutes = ['/reset-password', '/forgot-password'];
const siteRoutes = ['/', '/about', '/contact', '/privacy', '/terms'];
const publicRoutes = [...authRoutes, ...passwordRoutes, ...siteRoutes];

export default async function authMiddleware(request: NextRequest) {
	const pathName = request.nextUrl.pathname;

	// Skip middleware for public assets and API routes
	if (
		pathName.startsWith('/_next') ||
		pathName.startsWith('/api') ||
		pathName.match(/\.(png|jpg|jpeg|gif|ico)$/)
	) {
		return NextResponse.next();
	}

	try {
		const { data: session } = await betterFetch<Session>(
			'/api/auth/get-session',
			{
				baseURL: process.env.BETTER_AUTH_URL,
				headers: {
					cookie: request.headers.get('cookie') || '',
				},
			}
		);

		// If user is authenticated and tries to access auth routes, redirect to their organization
		if (
			session &&
			(authRoutes.includes(pathName) || passwordRoutes.includes(pathName))
		) {
			const organizationSlug = session.session.organizationSlug;

			if (organizationSlug) {
				return NextResponse.redirect(
					new URL(`/${organizationSlug}`, request.url)
				);
			}

			return NextResponse.redirect(new URL('/', request.url));
		}

		// If user is not authenticated and tries to access protected routes
		if (!session && !publicRoutes.includes(pathName)) {
			const callbackUrl = encodeURIComponent(pathName);
			return NextResponse.redirect(
				new URL(`/sign-in?callbackUrl=${callbackUrl}`, request.url)
			);
		}

		// If user is authenticated but accessing root, redirect to organization
		if (session && pathName === '/') {
			const organizationSlug = session.session.organizationSlug;

			if (organizationSlug) {
				return NextResponse.redirect(
					new URL(`/${organizationSlug}`, request.url)
				);
			}
		}

		return NextResponse.next();
	} catch (error) {
		console.error('Session check failed:', error);
		if (!publicRoutes.includes(pathName)) {
			return NextResponse.redirect(new URL('/sign-in', request.url));
		}
		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};

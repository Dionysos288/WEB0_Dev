import { betterAuth, BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { nextCookies } from 'better-auth/next-js';
import { customSession, organization } from 'better-auth/plugins';

const prisma = new PrismaClient();

type BaseSession = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	expiresAt: Date;
	token: string;
	ipAddress?: string | null;
	userAgent?: string | null;
	activeOrganizationId?: string;
	organizationSlug?: string;
};

const options = {
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		organization(),
		customSession(async ({ user, session }) => {
			const typedSession = session as BaseSession;
			let organizationSlug = null;

			if (typedSession.activeOrganizationId) {
				const org = await prisma.organization.findUnique({
					where: { id: typedSession.activeOrganizationId },
					select: { slug: true },
				});
				organizationSlug = org?.slug;
			}

			return {
				user,
				session: {
					...session,
					organizationSlug,
				},
			};
		}),
		nextCookies(),
	],
} satisfies BetterAuthOptions;

export const auth = betterAuth(options);

export type Session = {
	user: {
		id: string;
		email: string;
		emailVerified: boolean;
		name: string;
		createdAt: Date;
		updatedAt: Date;
		image?: string | null;
	};
	session: BaseSession;
};

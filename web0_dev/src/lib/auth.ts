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
	organizationName?: string;
};

const options = {
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		organization({
			teams: {
				enabled: true,
				maximumTeams: 10, // Optional: limit teams per organization
				allowRemovingAllTeams: false, // Optional: prevent removing the last team
			},
		}),
		customSession(async ({ user, session }) => {
			const typedSession = session as BaseSession;
			let organizationSlug = null;
			let organizationName = null;
			if (typedSession.activeOrganizationId) {
				const org = await prisma.organization.findUnique({
					where: { id: typedSession.activeOrganizationId },
					select: { slug: true, name: true },
				});
				organizationSlug = org?.slug;
				organizationName = org?.name;
			}

			return {
				user,
				session: {
					...session,
					organizationSlug,
					organizationName,
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
		image: string;
	};
	session: BaseSession;
};

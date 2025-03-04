'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { Member, User } from '@prisma/client';
import { headers } from 'next/headers';

export async function getOrganization(
	organizationSlug: string
): Promise<{ data: any | null; error: string | null }> {
	try {
		const organization = await auth.api.getFullOrganization({
			headers: await headers(),
			query: {
				organizationSlug,
			},
		});

		return { data: organization, error: null };
	} catch (error) {
		console.error('Failed to fetch organization:', error);
		return { data: null, error: 'Failed to fetch organization' };
	}
}

export async function setActiveOrganization(
	organizationSlug: string
): Promise<{ data: any; error: string | null }> {
	try {
		const result = await auth.api.setActiveOrganization({
			headers: await headers(),
			body: {
				organizationSlug,
			},
		});

		return { data: result, error: null };
	} catch (error) {
		console.error('Failed to set active organization:', error);
		return { data: null, error: 'Failed to set active organization' };
	}
}

export async function getUser(): Promise<{
	data: any | null;
	error: string | null;
}> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		return { data: session, error: null };
	} catch (error) {
		console.error('Failed to get user:', error);
		return { data: null, error: 'Failed to get user' };
	}
}

export async function getMembers(organizationId: string): Promise<{
	data: (Member & { user: User })[] | null;
	error: string | null;
}> {
	const members = await prisma.member.findMany({
		where: {
			organizationId,
		},
		include: {
			user: true,
		},
	});
	return { data: members, error: null };
}

export async function getSlug(organizationId: string): Promise<string | null> {
	const organization = await auth.api.getFullOrganization({
		headers: await headers(),
		query: {
			organizationId,
		},
	});
	if (!organization?.slug) {
		return null;
	}
	return organization.slug;
}

'use server';

import prisma from '@/lib/db';

export async function getLibraryItems() {
	try {
		const items = await prisma.libraryType.findMany({
			select: { slug: true },
		});
		return items;
	} catch (error) {
		console.error('Error fetching library items:', error);
		return [];
	}
}

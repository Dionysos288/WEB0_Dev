'use server';

import { ExtendedLibrary, SortOptions } from '@/components/types/types';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function updateFilterLibrary({
	selectedCategories,
	id,
	isAscending,
	query,
	type,
	favorite,
	organizationId,
}: {
	selectedCategories: string[];
	id?: string;
	isAscending: boolean;
	query: string;
	type: SortOptions;
	favorite: boolean;
	organizationId: string;
}) {
	try {
		const orderBy: Prisma.LibraryOrderByWithRelationInput =
			type === 'date'
				? { createdAt: isAscending ? 'asc' : 'desc' }
				: type === 'title'
				? { title: isAscending ? 'asc' : 'desc' }
				: { createdAt: 'desc' };

		const where: Prisma.LibraryWhereInput = {
			organizationId,
		};

		if (id) {
			where.libraryTypeId = id;
		}

		if (favorite) {
			where.favorite = true;
		}

		if (selectedCategories?.length > 0) {
			where.Category = {
				name: {
					in: selectedCategories,
				},
			};
		}

		if (query) {
			where.title = {
				contains: query,
				mode: 'insensitive',
			};
		}

		const data = await prisma.library.findMany({
			where,
			orderBy,
			include: {
				Category: true,
			},
		});

		if (!data) {
			return { data: [], error: 'No data found' };
		}

		return { data: data as ExtendedLibrary[] };
	} catch (error) {
		console.error('Query error:', error);
		return {
			data: [],
			error: 'An error occurred while fetching data.',
		};
	}
}

const makeFavorite = async (id: string, favorite: boolean) => {
	try {
		await prisma.library.update({
			where: { id },
			data: { favorite: !favorite, updatedAt: undefined },
		});
	} catch (error) {
		console.error(error);
		return {
			data: [],
			error: 'An error occurred while updating data.',
		};
	}

	revalidatePath('/library/favorites');
};

// New category management functions

// Create a new category
const createCategory = async ({
	name,
	organizationId,
	libraryTypeId,
	parentId = null,
}: {
	name: string;
	organizationId: string;
	libraryTypeId: string;
	parentId?: string | null;
}) => {
	try {
		const slug = name.toLowerCase().replace(/\s+/g, '-');

		const newCategory = await prisma.category.create({
			data: {
				name,
				slug,
				organizationId,
				libraryTypeId,
				parentId,
			},
		});

		return { success: true, category: newCategory };
	} catch (error) {
		console.error('Create category error:', error);
		return {
			success: false,
			error: 'An error occurred while creating the category.',
		};
	}
};

// Update a category's parent (for drag and drop)
const updateCategoryParent = async ({
	categoryId,
	newParentId,
}: {
	categoryId: string;
	newParentId: string | null;
}) => {
	try {
		// Check for circular references
		if (newParentId) {
			// Check if we would create a circular reference
			let currentId: string | null = newParentId;
			while (currentId) {
				const parent: { parentId: string | null } | null =
					await prisma.category.findUnique({
						where: { id: currentId },
						select: { parentId: true },
					});

				if (!parent) break;

				if (parent.parentId === categoryId) {
					return {
						success: false,
						error: 'Cannot move a category to its own descendant',
					};
				}

				currentId = parent.parentId;
			}
		}

		const updatedCategory = await prisma.category.update({
			where: { id: categoryId },
			data: { parentId: newParentId },
		});

		return { success: true, category: updatedCategory };
	} catch (error) {
		console.error('Update category error:', error);
		return {
			success: false,
			error: 'An error occurred while updating the category.',
		};
	}
};

// Get all categories for a library type
const getCategories = async (libraryTypeId: string, organizationId: string) => {
	try {
		const categories = await prisma.category.findMany({
			where: {
				libraryTypeId,
				organizationId,
			},
			include: {
				subcategories: {
					include: {
						subcategories: {
							include: {
								subcategories: true,
							},
						},
					},
				},
			},
		});

		return { success: true, categories };
	} catch (error) {
		console.error('Get categories error:', error);
		return {
			success: false,
			error: 'An error occurred while fetching categories.',
			categories: [],
		};
	}
};

// Create a new library item
const createLibrary = async ({
	title,
	description,
	url,
	libraryTypeId,
	categoryId,
	component = 'codeSplit',
	tags = [],
	projectId,
	organizationId,
}: {
	title: string;
	description?: string;
	url?: string;
	libraryTypeId: string;
	categoryId: string;
	component?: 'imageV1' | 'imageV2' | 'color' | 'codefull' | 'codeSplit';
	tags?: string[];
	projectId?: string;
	organizationId: string;
}) => {
	try {
		const newLibrary = await prisma.library.create({
			data: {
				title,
				description: description || '',
				url: url || '',
				libraryTypeId,
				categoryId,
				component,
				tags,
				projectId,
				organizationId,
				favorite: false,
			},
			include: {
				Category: true,
			},
		});

		return { success: true, library: newLibrary };
	} catch (error) {
		console.error('Create library error:', error);
		return {
			success: false,
			error: 'An error occurred while creating the library item.',
		};
	}
};

export {
	updateFilterLibrary,
	makeFavorite,
	createCategory,
	updateCategoryParent,
	getCategories,
	createLibrary,
};

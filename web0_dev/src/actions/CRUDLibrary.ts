'use server';

import { ExtendedLibrary, SortOptions } from '@/components/types/types';
import prisma from '@/lib/db';
import { libraryComponent, Prisma } from '@prisma/client';
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
			where.category = {
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
				category: true,
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

const createLibrary = async ({
	title,
	description,
	content,
	coverImageUrl,
	libraryTypeId,
	categoryId,
	component,
	tags = [],
	projectId,
	organizationId,
	imageUrls = [],
	colors = [],
	codeFiles = {},
}: {
	title: string;
	description?: string;
	content?: string;
	coverImageUrl: string;
	libraryTypeId: string;
	categoryId: string;
	component: libraryComponent;
	tags?: string[];
	projectId?: string;
	organizationId: string;
	imageUrls?: string[];
	colors?: Array<[string, string]>;
	codeFiles?: Record<string, string>;
}) => {
	try {
		const metadata: Record<string, unknown> = {};

		if (
			['codefull', 'codeSplit', 'codeCompiler'].includes(component) &&
			Object.keys(codeFiles).length > 0
		) {
			metadata.codeFiles = codeFiles;
		}

		if (
			['imageV1', 'imageV2', 'color'].includes(component) &&
			imageUrls.length > 0
		) {
			metadata.images = imageUrls;
		}

		if (component === 'color' && colors.length > 0) {
			metadata.colors = colors;
		}
		metadata.coverImageUrl = coverImageUrl;

		const newLibrary = await prisma.library.create({
			data: {
				title,
				description: description,
				libraryTypeId,
				categoryId,
				component,
				tags,
				projects: {
					connect: projectId ? [{ id: projectId }] : [],
				},
				organizationId,
				favorite: false,
				metadata: metadata,
				content: content,
			},
		});
		if (tags && tags.length > 0) {
			const organization = await prisma.organization.findUnique({
				where: { id: organizationId },
				select: { libraryTags: true },
			});

			if (organization) {
				const existingTags = organization.libraryTags || [];
				const newTags = tags.filter((tag) => !existingTags.includes(tag));

				if (newTags.length > 0) {
					await prisma.organization.update({
						where: { id: organizationId },
						data: {
							libraryTags: {
								set: [...existingTags, ...newTags],
							},
						},
					});
				}
			}
		}

		revalidatePath('/library');
		return { success: true, library: newLibrary };
	} catch (error) {
		console.error('Create library error:', error);
		return {
			success: false,
			error: 'An error occurred while creating the library item.',
		};
	}
};

async function updateLibraryProjects(libraryId: string, projectId: string) {
	try {
		const library = await prisma.library.findUnique({
			where: { id: libraryId },
			include: { projects: true },
		});

		if (!library) {
			throw new Error('Library not found');
		}

		const hasProject = library.projects.some((p) => p.id === projectId);

		const updatedLibrary = await prisma.library.update({
			where: { id: libraryId },
			data: {
				projects: {
					[hasProject ? 'disconnect' : 'connect']: {
						id: projectId,
					},
				},
			},
			include: { projects: true },
		});

		return { success: true, data: updatedLibrary };
	} catch (error) {
		console.error('Error updating library projects:', error);
		return { error: 'Failed to update library projects' };
	}
}
export {
	updateFilterLibrary,
	makeFavorite,
	createCategory,
	updateCategoryParent,
	getCategories,
	createLibrary,
	updateLibraryProjects,
};

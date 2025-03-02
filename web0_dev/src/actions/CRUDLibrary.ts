interface CreateLibraryParams {
	title: string;
	description?: string;
	categoryId?: string;
	componentType: string;
	organizationId: string;
	projectId: string;
	codeFiles?: Record<string, string>;
	imageUrls?: string[];
	colorPalette?: { name: string; hex: string }[];
	tags?: string[];
	coverImageUrl?: string;
}

export async function createLibrary(params: CreateLibraryParams) {
	try {
		const {
			title,
			description,
			categoryId,
			componentType,
			organizationId,
			projectId,
			codeFiles,
			imageUrls,
			colorPalette,
			tags,
			coverImageUrl,
		} = params;

		// Prepare metadata
		const metadata: any = {};

		if (codeFiles) {
			metadata.codeFiles = codeFiles;
		}

		if (imageUrls) {
			metadata.imageUrls = imageUrls;
		}

		if (colorPalette) {
			metadata.colorPalette = colorPalette;
		}

		if (coverImageUrl) {
			metadata.coverImageUrl = coverImageUrl;
		}

		// Create the library item
		const library = await prisma.library.create({
			data: {
				title,
				description,
				categoryId,
				component: componentType as any,
				organizationId,
				projectId: projectId || undefined,
				tags: tags || [],
				metadata,
			},
		});

		// If new tags were added, update the organization's libraryTags
		if (tags && tags.length > 0) {
			// Get the current organization
			const organization = await prisma.organization.findUnique({
				where: { id: organizationId },
				select: { libraryTags: true },
			});

			if (organization) {
				// Find new tags that aren't already in the organization's libraryTags
				const existingTags = organization.libraryTags || [];
				const newTags = tags.filter((tag) => !existingTags.includes(tag));

				// If there are new tags, update the organization
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

		return { success: true, library };
	} catch (error) {
		console.error('Error creating library:', error);
		return { error: 'Failed to create library item' };
	}
}

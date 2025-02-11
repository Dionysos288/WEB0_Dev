import { PrismaClient, Prisma, Category } from '@prisma/client';

const prisma = new PrismaClient();
const tasks = [
	{ title: 'Task #1 (Alltasks P1)', columnStatus: 'Backlog' },
	{ title: 'Task #2 (Alltasks P1)', columnStatus: 'Completed' },
	{ title: 'Task #3 (Alltasks P1)', columnStatus: 'inProgress' },
	{ title: 'Task #4 (Alltasks P1)', columnStatus: 'inProgress' },
	{ title: 'Task #5 (Alltasks P1)', columnStatus: 'Backlog' },
	{ title: 'Task #6 (Alltasks P1)', columnStatus: 'Backlog' },
];

const completedCount = tasks.filter(
	(t) => t.columnStatus === 'Completed'
).length;
const organizationId = 'COMhDJeWfdlOxGfDMQcmzZsG0xH2H14q';
const memberId1 = 'YYcq5cf6luny5EHXwFt81MgVYqcKNa4S';
const projectData: Prisma.ProjectCreateInput[] = [
	{
		id: '1ABC',
		title: 'Project 1',
		description: 'Project 1 description',
		budget: 1000,
		start: new Date(),
		due: new Date(Date.now() + 100 * 86400000),
		status: 'planned',
		lead: {
			connect: {
				id: memberId1,
			},
		},
		members: {
			connect: [{ id: memberId1 }, { id: memberId1 }],
		},
		completed: completedCount,
		Organization: {
			connect: {
				id: organizationId,
			},
		},

		phases: {
			create: [
				{
					id: 'A123',
					title: 'Testing',
					description: 'Testing',
					startDate: new Date(Date.now() - 10 * 86400000),
					endDate: new Date(Date.now() + 15 * 86400000),
					status: 'Not_Started',
					revisions: 3,
				},
				{
					id: 'B123',

					title: 'UI',
					description: 'UI',
					startDate: new Date(Date.now() - 15 * 86400000),
					endDate: new Date(Date.now() + 25 * 86400000),
					status: 'Not_Started',
				},
				{
					id: 'C123',

					title: 'Ending Phase',
					description: 'Ending Phase',
					startDate: new Date(Date.now() + 10 * 86400000),
					endDate: new Date(Date.now() + 35 * 86400000),
					status: 'Not_Started',
				},
			],
		},
		tasks: {
			create: [
				{
					title: 'Task #1 (Alltasks P1)',
					description: 'Task #1 description',
					priority: 3,
					status: 'Backlog',
					phaseId: 'A123',
				},
				{
					title: 'Task #2 (Alltasks P1)',
					description: 'Task #2 description',
					priority: 1,
					status: 'inProgress',
					phaseId: 'A123',
				},
				{
					title: 'Task #3 (Alltasks P1)',
					priority: 4,
					description: 'Task #3 description',
					status: 'Completed',
					phaseId: 'A123',
				},
				{
					title: 'Task #4 (Alltasks P1)',
					priority: 2,
					description: 'Task #4 description',
					status: 'inProgress',
				},
				{
					title: 'Task #5 (Alltasks P1)',
					priority: 3,
					description: 'Task #5 description',
					status: 'Backlog',
				},
				{
					title: 'Task #6 (Alltasks P1)',
					priority: 2,
					description: 'Task #6 description',
					status: 'Backlog',
				},
			],
		},
		Files: {
			create: [
				{
					phaseId: 'A123',
					name: 'File 1',
					url: 'https://www.google.com',
					description: 'File 1 description',
					size: 1000,
					uploader: 'John',
				},
				{
					name: 'File 1',
					url: 'https://www.google.com',
					description: 'File 1 description',
					size: 1000,
					uploader: 'John',
				},
			],
		},
	},
	{
		id: '2ABC',
		title: 'Project 1',
		budget: 1000,
		start: new Date(),
		due: new Date(Date.now() + 100 * 86400000),
		status: 'canceled',
		completed: completedCount,
		Organization: {
			connect: {
				id: organizationId,
			},
		},
		tasks: {
			create: [
				{
					title: 'Task #1 (Alltasks P1)',
					description: 'Task #1 description',
					priority: 3,
					status: 'Backlog',
				},
				{
					title: 'Task #2 (Alltasks P1)',
					description: 'Task #2 description',
					priority: 1,
					status: 'inProgress',
				},
				{
					title: 'Task #3 (Alltasks P1)',
					priority: 2,
					description: 'Task #3 description',
					status: 'Completed',
					phaseId: 'A123',
				},
				{
					title: 'Task #4 (Alltasks P1)',
					priority: 2,
					description: 'Task #4 description',
					status: 'inProgress',
				},
				{
					title: 'Task #5 (Alltasks P1)',
					priority: 3,
					description: 'Task #5 description',
					status: 'Backlog',
				},
				{
					title: 'Task #6 (Alltasks P1)',
					priority: 2,
					description: 'Task #6 description',
					status: 'Backlog',
				},
			],
		},
		phases: {
			create: [
				{
					id: 'D123',

					title: 'Testing',
					description: 'Testing',
					startDate: new Date(Date.now() - 10 * 86400000),
					endDate: new Date(Date.now() + 10 * 86400000),
					status: 'Not_Started',
				},
				{
					id: 'E123',

					title: 'UI',
					description: 'UI',
					startDate: new Date(Date.now() - 1 * 86400000),
					endDate: new Date(Date.now() + 10 * 86400000),
					status: 'Not_Started',
				},
				{
					id: 'F123',

					title: 'Ending Phase',
					description: 'Ending Phase',
					startDate: new Date(Date.now() + 1 * 86400000),
					endDate: new Date(Date.now() + 10 * 86400000),
					status: 'Not_Started',
				},
			],
		},
		Files: {
			create: [
				{
					phaseId: 'D123',

					name: 'File 1',
					url: 'https://www.google.com',
					description: 'File 1 description',
					size: 1000,
					uploader: 'John',
				},
				{
					name: 'File 1',
					url: 'https://www.google.com',
					description: 'File 1 description',
					size: 1000,
					uploader: 'John',
				},
			],
		},
	},
	{
		id: '3ABC',
		title: 'Project 1',
		budget: 1000,
		start: new Date(),
		due: new Date(Date.now() + 100 * 86400000),
		status: 'progress',
		completed: completedCount,
		Organization: {
			connect: {
				id: organizationId,
			},
		},
		tasks: {
			create: [
				{
					title: 'Task #1 (Alltasks P1)',
					description: 'Task #1 description',
					priority: 3,
					status: 'Backlog',
				},
				{
					title: 'Task #2 (Alltasks P1)',
					description: 'Task #2 description',
					priority: 1,
					status: 'inProgress',
				},
				{
					title: 'Task #3 (Alltasks P1)',
					priority: 2,
					description: 'Task #3 description',
					status: 'Completed',
					phaseId: 'A123',
				},
				{
					title: 'Task #4 (Alltasks P1)',
					priority: 2,
					description: 'Task #4 description',
					status: 'inProgress',
				},
				{
					title: 'Task #5 (Alltasks P1)',
					priority: 3,
					description: 'Task #5 description',
					status: 'Backlog',
				},
				{
					title: 'Task #6 (Alltasks P1)',
					priority: 2,
					description: 'Task #6 description',
					status: 'Backlog',
				},
			],
		},
		phases: {
			create: [
				{
					id: 'G123',

					title: 'Testing',
					description: 'Testing',
					startDate: new Date(Date.now() - 10 * 86400000),
					endDate: new Date(Date.now() + 10 * 86400000),
					status: 'Not_Started',
				},
				{
					id: 'H123',

					title: 'UI',
					description: 'UI',
					startDate: new Date(Date.now() - 1 * 86400000),
					endDate: new Date(Date.now() + 10 * 86400000),
					status: 'Not_Started',
				},
				{
					id: 'I123',

					title: 'Ending Phase',
					description: 'Ending Phase',
					startDate: new Date(Date.now() + 1 * 86400000),
					endDate: new Date(Date.now() + 10 * 86400000),
					status: 'Not_Started',
				},
			],
		},
		Files: {
			create: [
				{
					name: 'File 1',
					url: 'https://www.google.com',
					description: 'File 1 description',
					size: 1000,
					uploader: 'John',
				},
				{
					name: 'File 1',
					url: 'https://www.google.com',
					description: 'File 1 description',
					size: 1000,
					uploader: 'John',
				},
			],
		},
	},
	{
		id: '4ABC',
		title: 'Project 1',
		budget: 1000,
		start: new Date(),
		due: new Date(Date.now() + 100 * 86400000),
		status: 'completed',
		completed: 0,
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
];
const clientData: Prisma.ClientCreateInput[] = [
	{
		name: 'Client 1',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Call',
		status: 'Leads',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'dion ZEneli',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Mail',
		status: 'Leads',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'John',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Referral',
		status: 'Leads',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'Client 1',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Events',
		status: 'Contacted',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'dion ZEneli',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Other',
		status: 'Contacted',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'John',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Events',
		status: 'Contacted',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'Client 1',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Call',
		status: 'Opportunity',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'dion ZEneli',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Mail',
		status: 'Opportunity',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'John',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Website',
		status: 'Opportunity',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'Client 1',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Website',
		status: 'Client',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'dion ZEneli',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Website',
		status: 'Client',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		name: 'John',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Website',
		status: 'Client',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
];

const folderData: Prisma.FolderCreateInput[] = [
	{
		name: 'Design Documents',
		emoji: 'money',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
		notes: {
			create: [
				{
					title: 'Wireframe.png',
					description: '#1',
					organizationId: organizationId,
				},
				{
					title: 'Mockups.pdf',
					organizationId: organizationId,
				},
			],
		},
	},
	{
		name: 'Reports',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
		notes: {
			create: [
				{
					title: 'Q1Report.xlsx',
					description: '#1',
					organizationId: organizationId,
				},
				{
					title: 'Q2Report.xlsx',
					organizationId: organizationId,
				},
			],
		},
	},
	{
		name: 'Marketing',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
		notes: {
			create: [
				{
					title: 'CampaignIdeas.docx',
					description: '#1',
					organizationId: organizationId,
				},
				{
					title: 'Budget.xlsx',
					organizationId: organizationId,
				},
			],
		},
	},
];
const noteData: Prisma.NoteCreateInput[] = [
	{
		title: 'Wireframe.png',
		description: '#1',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		title: 'Mockups.pdf',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		title: 'Q1Report.xlsx',
		description: '#1',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		title: 'Q2Report.xlsx',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		title: 'CampaignIdeas.docx',
		description: '#1',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
	{
		title: 'Budget.xlsx',
		Organization: {
			connect: {
				id: organizationId,
			},
		},
	},
];

export async function main() {
	for (const project of projectData) {
		await prisma.project.create({
			data: project,
		});
	}

	for (const u of clientData) {
		await prisma.client.create({
			data: u,
		});
	}
	for (const u of folderData) {
		await prisma.folder.create({
			data: u,
		});
	}
	for (const u of noteData) {
		await prisma.note.create({
			data: u,
		});
	}

	const frontendType = await prisma.libraryType.create({
		data: {
			name: 'Frontend',
			slug: 'frontend',
		},
	});

	const backendType = await prisma.libraryType.create({
		data: {
			name: 'Backend',
			slug: 'backend',
		},
	});

	async function createCategories(libraryTypeId: string, baseName: string) {
		const category1 = await prisma.category.create({
			data: {
				name: `${baseName} Components`,
				slug: `${baseName.toLowerCase()}-components`,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const category2 = await prisma.category.create({
			data: {
				name: `${baseName} Utilities`,
				slug: `${baseName.toLowerCase()}-utilities`,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subcategory1 = await prisma.category.create({
			data: {
				name: `${baseName} Buttons`,
				slug: `${baseName.toLowerCase()}-buttons`,
				parentId: category1.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subcategory2 = await prisma.category.create({
			data: {
				name: `${baseName} Forms`,
				slug: `${baseName.toLowerCase()}-forms`,
				parentId: category1.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subSubcategory1 = await prisma.category.create({
			data: {
				name: `${baseName} Black Buttons`,
				slug: `${baseName.toLowerCase()}-black-buttons`,
				parentId: subcategory1.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subSubcategory2 = await prisma.category.create({
			data: {
				name: `${baseName} Orange Buttons`,
				slug: `${baseName.toLowerCase()}-orange-buttons`,
				parentId: subcategory1.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subSubcategory3 = await prisma.category.create({
			data: {
				name: `${baseName} Black Forms`,
				slug: `${baseName.toLowerCase()}-black-forms`,
				parentId: subcategory2.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subSubcategory4 = await prisma.category.create({
			data: {
				name: `${baseName} Orange Forms`,
				slug: `${baseName.toLowerCase()}-orange-forms`,
				parentId: subcategory2.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subcategory3 = await prisma.category.create({
			data: {
				name: `${baseName} Helpers`,
				slug: `${baseName.toLowerCase()}-helpers`,
				parentId: category2.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subcategory4 = await prisma.category.create({
			data: {
				name: `${baseName} Middlewares`,
				slug: `${baseName.toLowerCase()}-middlewares`,
				parentId: category2.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subSubcategory5 = await prisma.category.create({
			data: {
				name: `${baseName} Black Helpers`,
				slug: `${baseName.toLowerCase()}-black-helpers`,
				parentId: subcategory3.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subSubcategory6 = await prisma.category.create({
			data: {
				name: `${baseName} Orange Helpers`,
				slug: `${baseName.toLowerCase()}-orange-helpers`,
				parentId: subcategory3.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subSubcategory7 = await prisma.category.create({
			data: {
				name: `${baseName} Black Middlewares`,
				slug: `${baseName.toLowerCase()}-black-middlewares`,
				parentId: subcategory4.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		const subSubcategory8 = await prisma.category.create({
			data: {
				name: `${baseName} Orange Middlewares`,
				slug: `${baseName.toLowerCase()}-orange-middlewares`,
				parentId: subcategory4.id,
				libraryTypeId,
				organizationId: organizationId,
			},
		});

		return [
			category1,
			category2,
			subcategory1,
			subcategory2,
			subcategory3,
			subcategory4,
			subSubcategory1,
			subSubcategory2,
			subSubcategory3,
			subSubcategory4,
			subSubcategory5,
			subSubcategory6,
			subSubcategory7,
			subSubcategory8,
		];
	}

	const frontendCategories = await createCategories(
		frontendType.id,
		'Frontend'
	);

	const backendCategories = await createCategories(backendType.id, 'Backend');

	async function createLibraries(
		libraryTypeId: string,
		baseName: string,
		categories: Category[]
	) {
		for (let i = 1; i <= 10; i++) {
			const randomCategory =
				categories[Math.floor(Math.random() * categories.length)];

			await prisma.library.create({
				data: {
					title: `${baseName} Library ${i}`,
					description: `Description for ${baseName} Library ${i}`,
					url: `https://example.com/${baseName.toLowerCase()}-library-${i}`,
					libraryTypeId,
					component: 'codeSplit',
					favorite: i % 2 === 0,
					tags: [`${baseName.toLowerCase()}`, `tag${i}`],
					projectId: '1ABC',
					categoryId: randomCategory.id,
					organizationId: organizationId,
				},
			});
		}
	}

	await createLibraries(frontendType.id, 'Frontend', frontendCategories);

	await createLibraries(backendType.id, 'Backend', backendCategories);
}

main();

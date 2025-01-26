import { PrismaClient, Prisma, Category } from '@prisma/client';

const prisma = new PrismaClient();
const tasks = [
	{ title: 'Task #1 (Alltasks P1)', columnStatus: 'Backlog' },
	{ title: 'Task #2 (Alltasks P1)', columnStatus: 'Completed' },
	{ title: 'Task #3 (Alltasks P1)', columnStatus: 'In_Progress' },
	{ title: 'Task #4 (Alltasks P1)', columnStatus: 'In_Progress' },
	{ title: 'Task #5 (Alltasks P1)', columnStatus: 'Backlog' },
	{ title: 'Task #6 (Alltasks P1)', columnStatus: 'Backlog' },
];

const completedCount = tasks.filter(
	(t) => t.columnStatus === 'Completed'
).length;

const projectData: Prisma.ProjectCreateInput[] = [
	{
		id: '1ABC',
		title: 'Project 1',
		description: 'Project 1 description',
		budget: 1000,
		start: new Date(),
		due: new Date(Date.now() + 100 * 86400000),
		team: ['John', 'Doe'],
		status: 'pending',
		completed: completedCount,

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
					status: 'In_Progress',
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
					status: 'In_Progress',
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
		team: ['John', 'Doe'],
		status: 'rejected',
		completed: completedCount,
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
					status: 'In_Progress',
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
					status: 'In_Progress',
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
		team: ['John', 'Doe'],
		status: 'progress',
		completed: completedCount,
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
					status: 'In_Progress',
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
					status: 'In_Progress',
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
		team: ['John', 'Doe'],
		status: 'completed',
		completed: 0,
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
	},
	{
		name: 'dion ZEneli',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Mail',
		status: 'Leads',
	},
	{
		name: 'John',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Referral',
		status: 'Leads',
	},
	{
		name: 'Client 1',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Events',
		status: 'Contacted',
	},
	{
		name: 'dion ZEneli',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Other',
		status: 'Contacted',
	},
	{
		name: 'John',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Events',
		status: 'Contacted',
	},
	{
		name: 'Client 1',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Call',
		status: 'Opportunity',
	},
	{
		name: 'dion ZEneli',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Mail',
		status: 'Opportunity',
	},
	{
		name: 'John',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Website',
		status: 'Opportunity',
	},
	{
		name: 'Client 1',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Website',
		status: 'Client',
	},
	{
		name: 'dion ZEneli',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Website',
		status: 'Client',
	},
	{
		name: 'John',
		category: 'Restaturant',
		email: 'zenelidion288@gmail.com',
		company: 'Company 1',
		source: 'Website',
		status: 'Client',
	},
];

const folderData: Prisma.FolderCreateInput[] = [
	{
		name: 'Design Documents',
		emoji: 'money',
		notes: {
			create: [
				{ title: 'Wireframe.png', description: '#1' },
				{ title: 'Mockups.pdf' },
			],
		},
	},
	{
		name: 'Reports',
		notes: {
			create: [
				{ title: 'Q1Report.xlsx', description: '#1' },
				{ title: 'Q2Report.xlsx' },
			],
		},
	},
	{
		name: 'Marketing',
		notes: {
			create: [
				{ title: 'CampaignIdeas.docx', description: '#1' },
				{ title: 'Budget.xlsx' },
			],
		},
	},
];
const noteData: Prisma.NoteCreateInput[] = [
	{
		title: 'Wireframe.png',
		description: '#1',
	},
	{
		title: 'Mockups.pdf',
	},
	{
		title: 'Q1Report.xlsx',
		description: '#1',
	},
	{
		title: 'Q2Report.xlsx',
	},
	{
		title: 'CampaignIdeas.docx',
		description: '#1',
	},
	{
		title: 'Budget.xlsx',
	},
];

export async function main() {
	for (const u of projectData) {
		await prisma.project.create({ data: u });
	}

	for (const u of clientData) {
		await prisma.client.create({ data: u });
	}
	for (const u of folderData) {
		await prisma.folder.create({ data: u });
	}
	for (const u of noteData) {
		await prisma.note.create({ data: u });
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
			},
		});

		const category2 = await prisma.category.create({
			data: {
				name: `${baseName} Utilities`,
				slug: `${baseName.toLowerCase()}-utilities`,
				libraryTypeId,
			},
		});

		const subcategory1 = await prisma.category.create({
			data: {
				name: `${baseName} Buttons`,
				slug: `${baseName.toLowerCase()}-buttons`,
				parentId: category1.id,
				libraryTypeId,
			},
		});

		const subcategory2 = await prisma.category.create({
			data: {
				name: `${baseName} Forms`,
				slug: `${baseName.toLowerCase()}-forms`,
				parentId: category1.id,
				libraryTypeId,
			},
		});

		const subSubcategory1 = await prisma.category.create({
			data: {
				name: `${baseName} Black Buttons`,
				slug: `${baseName.toLowerCase()}-black-buttons`,
				parentId: subcategory1.id,
				libraryTypeId,
			},
		});

		const subSubcategory2 = await prisma.category.create({
			data: {
				name: `${baseName} Orange Buttons`,
				slug: `${baseName.toLowerCase()}-orange-buttons`,
				parentId: subcategory1.id,
				libraryTypeId,
			},
		});

		const subSubcategory3 = await prisma.category.create({
			data: {
				name: `${baseName} Black Forms`,
				slug: `${baseName.toLowerCase()}-black-forms`,
				parentId: subcategory2.id,
				libraryTypeId,
			},
		});

		const subSubcategory4 = await prisma.category.create({
			data: {
				name: `${baseName} Orange Forms`,
				slug: `${baseName.toLowerCase()}-orange-forms`,
				parentId: subcategory2.id,
				libraryTypeId,
			},
		});

		const subcategory3 = await prisma.category.create({
			data: {
				name: `${baseName} Helpers`,
				slug: `${baseName.toLowerCase()}-helpers`,
				parentId: category2.id,
				libraryTypeId,
			},
		});

		const subcategory4 = await prisma.category.create({
			data: {
				name: `${baseName} Middlewares`,
				slug: `${baseName.toLowerCase()}-middlewares`,
				parentId: category2.id,
				libraryTypeId,
			},
		});

		const subSubcategory5 = await prisma.category.create({
			data: {
				name: `${baseName} Black Helpers`,
				slug: `${baseName.toLowerCase()}-black-helpers`,
				parentId: subcategory3.id,
				libraryTypeId,
			},
		});

		const subSubcategory6 = await prisma.category.create({
			data: {
				name: `${baseName} Orange Helpers`,
				slug: `${baseName.toLowerCase()}-orange-helpers`,
				parentId: subcategory3.id,
				libraryTypeId,
			},
		});

		const subSubcategory7 = await prisma.category.create({
			data: {
				name: `${baseName} Black Middlewares`,
				slug: `${baseName.toLowerCase()}-black-middlewares`,
				parentId: subcategory4.id,
				libraryTypeId,
			},
		});

		const subSubcategory8 = await prisma.category.create({
			data: {
				name: `${baseName} Orange Middlewares`,
				slug: `${baseName.toLowerCase()}-orange-middlewares`,
				parentId: subcategory4.id,
				libraryTypeId,
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
				},
			});
		}
	}

	await createLibraries(frontendType.id, 'Frontend', frontendCategories);

	await createLibraries(backendType.id, 'Backend', backendCategories);
}

main();

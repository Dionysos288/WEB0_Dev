import { PrismaClient, Prisma } from '@prisma/client';

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
const Taskdata: Prisma.TaskColumnCreateInput[] = [
	{
		title: 'Backlog',
		Tasks: {
			create: [
				{
					title: 'Task #1 (Allsdftasks P1)',
					description: 'ik ben description',
					projectId: '1ABC',
					phaseId: 'A123',
				},
				{
					title: 'Task #5 (Alltsdfasks P1)',
					description: 'ik ben description',
					projectId: '2ABC',
				},
				{
					title: 'Task #6 (Alltsfasks P1)',
					description: 'ik ben description',
					projectId: '3ABC',
				},
				{
					title: 'Task #1 (Alltafsks P1)',
					description: 'ik ben description',
					projectId: '1ABC',
					phaseId: 'A123',
				},
				{
					title: 'Task #5 (Alltasdfsks P1)',
					description: 'ik ben description',
					projectId: '2ABC',
				},
				{
					title: 'Task #6 (Alltsdfasks P1)',
					description: 'ik ben description',
					projectId: '3ABC',
				},
				{
					title: 'Task #1 (Alsfdltasks P1)',
					description: 'ik ben description',
					projectId: '1ABC',
					phaseId: 'A123',
				},
				{
					title: 'Task #5 (Alltassdfks P1)',
					description: 'ik ben description',
					projectId: '2ABC',
				},
				{
					title: 'Task #6 (Alltassdfks P1)',
					projectId: '3ABC',
				},
			],
		},
	},
	{
		title: 'In_Progress',
		Tasks: {
			create: [
				{
					title: 'Task #1 (Allsdftasks P1)',
					description: 'ik ben description',
					projectId: '1ABC',
					phaseId: 'A123',
				},
				{
					title: 'Task #5 (Alltsdfasks P1)',
					description: 'ik ben description',
					projectId: '2ABC',
				},
				{
					title: 'Task #6 (Alltsdfasks P1)',
					description: 'ik ben description',
					projectId: '3ABC',
				},
				{
					title: 'Task #1 (Alltsdfasks P1)',
					description: 'ik ben description',
					projectId: '1ABC',
					phaseId: 'A123',
				},
				{
					title: 'Task #5 (Alltsfasks P1)',
					description: 'ik ben description',
					projectId: '2ABC',
				},
				{
					title: 'Task #6 (Alltasdfsks P1)',
					description: 'ik ben description',
					projectId: '3ABC',
				},
				{
					title: 'Task #1 (Alltassdfks P1)',
					description: 'ik ben description',
					projectId: '1ABC',
					phaseId: 'A123',
				},
				{
					title: 'Task #5 (Alltassdfks P1)',
					description: 'ik ben description',
					projectId: '2ABC',
				},
				{
					title: 'Task #6 (Alltassdfks P1)',
					projectId: '3ABC',
				},
			],
		},
	},
	{
		title: 'Completed',
		Tasks: {
			create: [
				{
					title: 'Task #1 (Alltassdfks P1)',
					description: 'ik ben description',
					projectId: '1ABC',
					phaseId: 'A123',
				},
				{
					title: 'Task #5 (Alltsdfasks P1)',
					description: 'ik ben description',
					projectId: '2ABC',
				},
				{
					title: 'Task #6 (Alltassdfks P1)',
					description: 'ik ben description',
					projectId: '3ABC',
				},
				{
					title: 'Task #1 (Alltasdfsks P1)',
					description: 'ik ben description',
					projectId: '1ABC',
					phaseId: 'A123',
				},
				{
					title: 'Task #5 (Alltasdfsks P1)',
					description: 'ik ben description',
					projectId: '2ABC',
				},
				{
					title: 'Task #6 (Alltassdfks P1)',
					description: 'ik ben description',
					projectId: '3ABC',
				},
				{
					title: 'Task #1 (Allsdftasks P1)',
					description: 'ik ben description',
					projectId: '1ABC',
					phaseId: 'A123',
				},
				{
					title: 'Task #5 (Alsdfltasks P1)',
					description: 'ik ben description',
					projectId: '2ABC',
				},
				{
					title: 'Task #6 (Alltasksdfs P1)',
					projectId: '3ABC',
				},
			],
		},
	},
];
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
	for (const u of Taskdata) {
		await prisma.taskColumn.create({ data: u });
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
}

main();

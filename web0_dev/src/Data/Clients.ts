import { ClientColumnType, clientType } from '@/components/types/types';

const Clients: clientType[] = [
	{
		id: 1,
		name: 'dion zeneli',
		type: 'Leads',
		columnId: 123,
		category: 'Restaurants',
		email: 'zenelidion288@gmail.com',
		company: 'Tesla',
		source: 'Facebook',
	},
	{
		id: 2,
		name: 'dion zeneli',
		type: 'Contacted',
		columnId: 234,

		category: 'Restaurants',
		email: 'zenelidion288@gmail.com',
		company: 'Tesla',
		source: 'Facebook',
	},
	{
		id: 3,
		name: 'dion zeneli',
		type: 'Opportunity',
		columnId: 345,

		category: 'Restaurants',
		email: 'zenelidion288@gmail.com',
		company: 'Tesla',
		source: 'Facebook',
	},
	{
		id: 4,
		name: 'dion zeneli',
		columnId: 456,

		type: 'Client',
		category: 'Restaurants',
		email: 'zenelidion288@gmail.com',
		company: 'Tesla',
		source: 'Facebook',
	},
	{
		id: 5,
		name: 'dion zeneli',
		type: 'Leads',
		columnId: 123,

		category: 'Restaurants',
		email: 'zenelidion288@gmail.com',
		company: 'Tesla',
		source: 'Facebook',
	},
	{
		id: 6,
		name: 'dion zeneli',
		type: 'Leads',
		columnId: 123,

		category: 'Restaurants',
		email: 'zenelidion288@gmail.com',
		company: 'Tesla',
		source: 'Facebook',
	},
];

const columnsData: ClientColumnType[] = [
	{
		id: 123,
		title: 'Leads',
		tasks: Clients.filter((task) => task.columnId === 123),
	},
	{
		id: 234,
		title: 'Contacted',
		tasks: Clients.filter((task) => task.columnId === 234),
	},
	{
		id: 345,
		title: 'Opportunity',
		tasks: Clients.filter((task) => task.columnId === 345),
	},
	{
		id: 456,
		title: 'Client',
		tasks: Clients.filter((task) => task.columnId === 456),
	},
];

export { Clients, columnsData };

import { getUser } from '@/actions/AccountActions';
import ClientTeamsPage from '@/components/pages/settings/administration/teams/ClientTeamsPage';
import { TableHeader } from '@/components/types/types';
import prisma from '@/lib/db';
import DatePickerV2 from '@/svgs/DatePickerV2';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: `Team `,
		description: `View Team on Web0`,
	};
}
const tableHeaders: TableHeader[] = [
	['name', 'Name'],
	['members', 'members'],
	['issues', 'Issues'],
	[
		'createdAt',
		'Created',
		<DatePickerV2
			fill="var(--main)"
			width="16"
			height="16"
			key="date-picker"
		/>,
	],
];
const page = async () => {
	const { data: session } = await getUser();
	const organizationId = session?.session.organizationId;

	const teams = await prisma.team.findMany({
		where: {
			organizationId: organizationId,
		},
		select: {
			id: true,
			name: true,
			createdAt: true,
			_count: {
				select: {
					members: true,
					issues: true,
				},
			},
		},
	});
	const teamsData = teams.map((team) => ({
		...team,
		members: team._count.members,
		issues: team._count.issues,
	}));
	if (teams) {
		return (
			<>
				<ClientTeamsPage teamsData={teamsData} tableHeaders={tableHeaders} />
			</>
		);
	}
};

export default page;

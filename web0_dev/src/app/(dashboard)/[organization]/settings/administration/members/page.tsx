import { getUser } from '@/actions/AccountActions';
import ClientMembersPage from '@/components/pages/settings/administration/members/ClientMembersPage';
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
	['email', 'Email'],
	['role', 'Role'],
	[
		'createdAt',
		'Joined',
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

	const members = await prisma.member.findMany({
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
	const membersData = members.map((member) => ({
		...member,
		members: member._count.members,
		issues: member._count.issues,
	}));
	if (members) {
		return (
			<>
				<ClientMembersPage
					membersData={membersData}
					tableHeaders={tableHeaders}
				/>
			</>
		);
	}
};

export default page;

import { getUser } from '@/actions/AccountActions';
import ProfilePage from '@/components/pages/settings/profile/ProfilePage';
import prisma from '@/lib/db';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: `Profile `,
		description: `View Profile on Web0`,
	};
}
const page = async () => {
	const { data: session } = await getUser();
	const userId = session?.session.userId;
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});
	return (
		<>
			<ProfilePage user={user} />
		</>
	);
};

export default page;

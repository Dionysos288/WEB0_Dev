import type { Metadata } from 'next';
import SecurityPage from '@/components/pages/settings/account/security/SecurityPage';
import { getSessions } from '@/actions/AccountActions';
export async function generateMetadata(): Promise<Metadata> {
	return {
		title: `Security `,
		description: `View Security on Web0`,
	};
}
const page = async () => {
	const { data: sessions } = await getSessions();

	console.log(sessions);

	return <SecurityPage sessions={sessions} />;
};

export default page;

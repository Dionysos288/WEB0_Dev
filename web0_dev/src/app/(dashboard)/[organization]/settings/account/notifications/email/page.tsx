import type { Metadata } from 'next';
import EmailPage from '@/components/pages/settings/account/notifications/email/EmailPage';
export async function generateMetadata(): Promise<Metadata> {
	return {
		title: `Notifications `,
		description: `View Notifications on Web0`,
	};
}
const page = () => {
	return <EmailPage />;
};

export default page;

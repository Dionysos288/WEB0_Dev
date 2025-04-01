import type { Metadata } from 'next';
import NotificationsPage from '@/components/pages/settings/account/notifications/NotificationsPage';
export async function generateMetadata(): Promise<Metadata> {
	return {
		title: `Notifications `,
		description: `View Notifications on Web0`,
	};
}
const page = () => {
	return <NotificationsPage />;
};

export default page;

import LayoutClient from '@/components/general/LayoutClient';
import { getUser } from '@/actions/AccountActions';
import { getLibraryItems } from '@/actions/LibraryActions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Projects',
	description: '',
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Fetch initial data at the layout level
	const [libraryItems, { data: session }] = await Promise.all([
		getLibraryItems(),
		getUser(),
	]);

	if (!session) {
		return null;
	}

	return (
		<LayoutClient initialLibraryItems={libraryItems} initialSession={session}>
			{children}
		</LayoutClient>
	);
}

import TopMenu from '@/components/General/TopMenu';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Library',
	description: '',
};

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<TopMenu
				menuItems={[
					'Overview',
					'Tasks',
					'Client Portal',
					'Files',
					'Library',
					'Settings',
				]}
				AddItem="Add Task"
			/>
			{children}
		</>
	);
}

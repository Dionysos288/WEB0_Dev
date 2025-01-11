import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConsoleLogger from '@/components/general/Consolelogger';
import Layout from '@/components/general/Layout';
import LenisWrapper from '@/components/general/LenisWrapper';

const inter = Inter({
	weight: ['400', '500', '600'],
	variable: '--inter',
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Web0 Admin',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable}`}>
				<ConsoleLogger />
				<LenisWrapper>
					<Layout>{children}</Layout>
				</LenisWrapper>
			</body>
		</html>
	);
}

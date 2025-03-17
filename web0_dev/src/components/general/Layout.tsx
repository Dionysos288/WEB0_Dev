'use client';

import { Dispatch, SetStateAction } from 'react';
import Footer from './Footer';
import Header from './header/Header';
import styles from './Layout.module.scss';
import { Session } from '@/lib/auth';
import ClientSideBar from './sidebar/ClientSideBar';
import ClientCommentsSidebar from './comments/ClientCommentsSidebar';

interface LayoutProps {
	children: React.ReactNode;
	isTaskDetailPage: boolean;
	isOpenLeftBar: boolean;
	setIsOpenLeftBar: Dispatch<SetStateAction<boolean>>;
	isOpenRightBarNotifications: boolean;
	isOpenRightBarComments: boolean;
	setIsOpenRightBarNotifications: Dispatch<SetStateAction<boolean>>;
	setIsOpenRightBarComments: Dispatch<SetStateAction<boolean>>;
	widthLeftbar: string;
	widthRightbar: string;
	initialLibraryItems: { slug: string }[];
	initialSession: Session;
}

const Layout = ({
	children,
	isTaskDetailPage,
	isOpenLeftBar,
	setIsOpenLeftBar,
	isOpenRightBarNotifications,
	isOpenRightBarComments,
	setIsOpenRightBarNotifications,
	setIsOpenRightBarComments,
	widthLeftbar,
	widthRightbar,
	initialLibraryItems,
	initialSession,
}: LayoutProps) => {
	return (
		<div className={styles.layout}>
			<nav
				className={`${styles.sidebar} ${
					!isOpenLeftBar ? styles.closedLeft : ''
				}`}
			>
				<ClientSideBar
					libraryItems={initialLibraryItems}
					session={initialSession}
				/>
			</nav>
			<div
				className={styles.main}
				style={{
					paddingLeft: isOpenLeftBar ? widthLeftbar : '0',
					paddingRight:
						isOpenRightBarNotifications || isOpenRightBarComments
							? widthRightbar
							: '0',
				}}
			>
				<Header
					isOpenLeftBar={isOpenLeftBar}
					onToggleLeftBar={setIsOpenLeftBar}
					isOpenRightBarNotifications={isOpenRightBarNotifications}
					isOpenRightBarComments={isOpenRightBarComments}
					isTaskDetailPage={isTaskDetailPage}
					widthLeftbar={widthLeftbar}
					widthRightbar={widthRightbar}
					onToggleNotifications={setIsOpenRightBarNotifications}
					onToggleComments={setIsOpenRightBarComments}
				/>
				<main
					className={`${!isOpenLeftBar ? styles.leftOpen : styles.standard} ${
						isOpenRightBarNotifications || isOpenRightBarComments
							? styles.rightOpen
							: styles.standard
					}`}
				>
					<div className={styles.fakeHeader}></div>
					{children}
				</main>
				<Footer />
			</div>
			<div
				className={`${styles.rightBar} ${
					!isOpenRightBarNotifications && !isOpenRightBarComments
						? styles.closedRight
						: ''
				}`}
			>
				<ClientCommentsSidebar
					isOpen={isOpenRightBarComments}
					onClose={() => setIsOpenRightBarComments(false)}
				/>
			</div>
		</div>
	);
};

export default Layout;

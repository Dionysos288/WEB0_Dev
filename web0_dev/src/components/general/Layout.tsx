'use client';

import { useState, useRef } from 'react';
import Footer from './Footer';
import Header from './header/Header';
import RightBar from './header/Rightbar';
import SideBar from './header/SideBar';
import styles from './Layout.module.scss';

const Layout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const [isOpenLeftBar, setIsOpenLeftBar] = useState(true);
	const [isOpenRightBar, setIsOpenRightBar] = useState(true);

	const widthLeftbar = 212;
	const widthRightbar = 280;

	return (
		<div className={styles.layout}>
			<nav
				className={`${styles.sidebar} ${
					!isOpenLeftBar ? styles.closedLeft : ''
				}`}
			>
				<SideBar />
			</nav>
			<div
				className={styles.main}
				style={{
					paddingLeft: isOpenLeftBar ? widthLeftbar : '0',
					paddingRight: isOpenRightBar ? widthRightbar : '0',
				}}
			>
				<Header
					setIsOpenLeftBar={() => setIsOpenLeftBar(!isOpenLeftBar)}
					setIsOpenRightBar={() => setIsOpenRightBar(!isOpenRightBar)}
				/>
				<main
					className={`${!isOpenLeftBar ? styles.leftOpen : styles.standard} ${
						!isOpenRightBar ? styles.rightOpen : styles.standard
					}`}
				>
					{children}
				</main>
				<Footer />
			</div>
			<div
				className={`${styles.rightBar} ${
					!isOpenRightBar ? styles.closedRight : ''
				}`}
			>
				<RightBar />
			</div>
		</div>
	);
};

export default Layout;

import ServerSideBar from '../Server/ServerSideBar';
import Footer from './Footer';
import Header from './header/Header';
import RightBar from './header/Rightbar';
import styles from './Layout.module.scss';

interface LayoutProps {
	children: React.ReactNode;

	isOpenLeftBar: boolean;
	isOpenRightBar: boolean;
	widthLeftbar: string;
	widthRightbar: string;
}

const Layout = ({
	children,

	isOpenLeftBar,
	isOpenRightBar,
	widthLeftbar,
	widthRightbar,
}: LayoutProps) => {
	return (
		<div className={styles.layout}>
			<nav
				className={`${styles.sidebar} ${
					!isOpenLeftBar ? styles.closedLeft : ''
				}`}
			>
				<ServerSideBar />
			</nav>
			<div
				className={styles.main}
				style={{
					paddingLeft: isOpenLeftBar ? widthLeftbar : '0',
					paddingRight: isOpenRightBar ? widthRightbar : '0',
				}}
			>
				<Header
					isOpenLeftBar={isOpenLeftBar}
					isOpenRightBar={isOpenRightBar}
					widthLeftbar={widthLeftbar}
					widthRightbar={widthRightbar}
				/>
				<main
					className={`${!isOpenLeftBar ? styles.leftOpen : styles.standard} ${
						!isOpenRightBar ? styles.rightOpen : styles.standard
					}`}
				>
					<div className={styles.fakeHeader}></div>
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

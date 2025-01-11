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
	return (
		<div className={styles.layout}>
			<SideBar />
			<div className={styles.main}>
				<Header />
				<main>{children}</main>
				<Footer />
			</div>
			<RightBar />
		</div>
	);
};

export default Layout;

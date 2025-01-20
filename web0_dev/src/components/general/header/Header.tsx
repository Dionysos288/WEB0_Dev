import SVG from '../SVG';
import BreadCrumbs from './BreadCrumbs';
import styles from './Header.module.scss';
import { History, Notification, Search, Side, Star, Sun } from '@/svgs';
const Header = ({ setIsOpenLeftBar, setIsOpenRightBar }) => {
	return (
		<>
			<header className={styles.header}>
				<div className={styles.leftSide}>
					<div style={{ display: 'contents' }} onClick={setIsOpenLeftBar}>
						<SVG>
							<Side style={{ fill: '#484643' }} />
						</SVG>
					</div>

					<SVG>
						<Star />
					</SVG>
					<BreadCrumbs />
				</div>
				<div className={styles.rightSide}>
					<span>
						<Search style={{ fill: '#484643' }} />
					</span>
					<div className={styles.emojis}>
						<SVG>
							<Sun style={{ fill: '#484643' }} />
						</SVG>
						<SVG>
							<History style={{ fill: '#484643' }} />
						</SVG>
						<SVG>
							<Notification style={{ fill: '#484643' }} />
						</SVG>
						<div style={{ display: 'contents' }} onClick={setIsOpenRightBar}>
							<SVG>
								<Side style={{ fill: '#484643' }} />
							</SVG>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;

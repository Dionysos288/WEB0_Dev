import SVG from '../SVG';
import BreadCrumbs from './BreadCrumbs';
import styles from './Header.module.scss';
import { History, Notification, Search, Side, Star, Sun } from '@/svgs';
const Header = () => {
	return (
		<>
			<header className={styles.header}>
				<div className={styles.leftSide}>
					<SVG>
						<Side style={{ fill: '#484643' }} />
					</SVG>

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
						<SVG>
							<Side style={{ fill: '#484643' }} />
						</SVG>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;

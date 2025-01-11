import Link from 'next/link';
import SVG from './SVG';
import styles from './TopMenu.module.scss';
import { Plus, Dots } from '@/svgs';
interface TopMenuProps {
	menuItems: string[];
	AddItem: string;
	ExtraItems?: string[];
}

const TopMenu: React.FC<TopMenuProps> = ({
	menuItems,
	AddItem,
	ExtraItems,
}) => {
	return (
		<div className={styles.container}>
			<div className={styles.menu}>
				{menuItems.map((item, index) => (
					<Link
						href={index === 0 ? '/library' : `/library/${item.toLowerCase()}`}
						key={index}
					>
						{item}
					</Link>
				))}
			</div>
			<div className={styles.rightSide}>
				<button className={styles.addItem}>
					<Plus style={{ fill: '#484643', opacity: '0.6' }} />
					<h5>{AddItem}</h5>
				</button>
				<div className={styles.extraItems}>
					<SVG>
						<Dots style={{ fill: '#484643', opacity: '0.6' }} />
					</SVG>
				</div>
			</div>
		</div>
	);
};

export default TopMenu;

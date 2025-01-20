import Link from 'next/link';
import SVG from './SVG';
import styles from './TopMenu.module.scss';
import { Plus, Dots } from '@/svgs';
interface TopMenuProps {
	mainLink: string;
	menuItems: string[];
	AddItem: string;
	ExtraItems?: string[];
	foundLink: string;
}

const TopMenu: React.FC<TopMenuProps> = ({
	mainLink,
	menuItems,
	AddItem,
	ExtraItems,
	foundLink,
}) => {
	return (
		<div className={styles.container}>
			<div className={styles.menu}>
				{menuItems.map((item, index) => (
					<Link
						href={
							index === 0
								? `/${mainLink}`
								: `/${mainLink}/${item.toLowerCase().replace(/\s+/g, '-')}`
						}
						key={index}
						className={` ${
							foundLink === item.toLowerCase().replace(/\s+/g, '-')
								? styles.active
								: ''
						}`}
						aria-current={
							foundLink === item.toLowerCase().replace(/\s+/g, '-')
								? 'page'
								: undefined
						}
					>
						{item}
					</Link>
				))}
			</div>
			<div className={styles.rightSide}>
				<button className={styles.addItem}>
					<Plus fill={'var(--main)'} opacity={'0.6'} />
					<span>{AddItem}</span>
				</button>
				<div className={styles.extraItems}>
					<SVG>
						<Dots fill={'var(--main)'} opacity={'0.6'} />
					</SVG>
				</div>
			</div>
		</div>
	);
};

export default TopMenu;

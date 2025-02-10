'use client';
import Link from 'next/link';
import SVG from './SVG';
import styles from './TopMenu.module.scss';
import { usePathname } from 'next/navigation';
import PlusStroke from '@/svgs/Plus-stroke';
import Dots from '@/svgs/Dots';

interface TopMenuProps {
	menuItems: string[];
	menuLinks: string[];
	AddItem: string;
	ExtraItems?: string[];
	foundLink?: string;
}

const TopMenu: React.FC<TopMenuProps> = ({
	menuItems,
	menuLinks,
	AddItem,
	ExtraItems,
	foundLink,
}) => {
	console.log(ExtraItems);
	const router = usePathname();
	console.log(router);
	return (
		<div className={styles.container}>
			<div className={styles.menu}>
				{menuItems.map((item, index) =>
				
						<Link
							href={`/${menuLinks[index]}`}
							key={index}
							className={` ${
								router === `/${menuLinks[index]}` ? styles.active : ''
								}`}
							aria-current={foundLink === `/${menuLinks[index]}` ? 'page' : undefined}
						>

							{item}
						</Link>
					
				)}
			</div>
			<div className={styles.rightSide}>
				<button className={styles.addItem}>
					<PlusStroke
						fill={'var(--main)'}
						style={{ opacity: '0.6' }}
						width="16"
						height="16"
					/>
					<span>{AddItem}</span>
				</button>
				<div className={styles.extraItems}>
					<SVG>
						<Dots fill={'var(--main-60)'} width="20" height="20" />
					</SVG>
				</div>
			</div>
		</div>
	);
};

export default TopMenu;

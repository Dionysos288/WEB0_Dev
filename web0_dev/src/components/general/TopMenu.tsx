'use client';
import Link from 'next/link';
import SVG from './SVG';
import styles from './TopMenu.module.scss';
import { Plus, Dots } from '@/svgs';
import { usePathname } from 'next/navigation';

interface TopMenuProps {
	mainLink: string;
	menuItems: string[];
	menuLinks?: string[];
	AddItem: string;
	ExtraItems?: string[];
	foundLink?: string;
}

const TopMenu: React.FC<TopMenuProps> = ({
	mainLink,
	menuItems,
	menuLinks,
	AddItem,
	ExtraItems,
	foundLink,
}) => {
	console.log(ExtraItems);
	const router = usePathname();

	if (!foundLink) {
		const urlParts = router.split('/');
		const mainLinkIndex = urlParts.indexOf(mainLink);
		if (urlParts.length === 2 && urlParts[1] === mainLink) {
			foundLink = `/${mainLink}`;
		} else if (mainLinkIndex !== -1 && mainLinkIndex < urlParts.length - 1) {
			foundLink = urlParts.slice(mainLinkIndex).join('/');
		}
		console.log(foundLink);
	}
	return (
		<div className={styles.container}>
			<div className={styles.menu}>
				{menuItems.map((item, index) =>
					menuLinks ? (
						<Link
							href={`/${menuLinks[index]}`}
							key={index}
							className={` ${
								foundLink === menuLinks[index] ? styles.active : ''
							}`}
							aria-current={foundLink === menuLinks[index] ? 'page' : undefined}
						>
							{item}
						</Link>
					) : (
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
					)
				)}
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

'use client';
import Image from 'next/image';
import styles from './SideBar.module.scss';
import {
	Arrow,
	ChartPie,
	Library,
	Projects,
	Leads,
	Notes,
	Social,
} from '@/svgs';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';

const SideBar = ({ libraryItems }: { libraryItems: { slug: string }[] }) => {
	const items = ['Overview', 'Projects'];
	const [favState, setFavState] = useState(true);
	const [openClient, setOpenClient] = useState(false);

	const toggleFav = () => {
		setFavState(!favState);
	};
	return (
		<div className={styles.sideBarWrapper}>
			<div className={styles.SideBar}>
				<div className={styles.user}>
					<div className={styles.imgWrapper}>
						<Image
							src="https://placehold.co/24"
							alt="user"
							width={24}
							height={24}
						/>
					</div>
					<p>Dion Zeneli</p>
				</div>
				<div className={styles.highlight}>
					<div className={styles.favorites}>
						<button
							onClick={() => {
								if (!favState) toggleFav();
							}}
						>
							<h2 className={favState ? styles.active : styles.normal}>
								Favorites
							</h2>
						</button>
						<button
							onClick={() => {
								if (favState) toggleFav();
							}}
						>
							<h2 className={favState ? styles.normal : styles.active}>
								Recently
							</h2>
						</button>
					</div>
					<div className={styles.items}>
						{items.map((item, index) => (
							<Link href={'/'} className={styles.horizontal} key={index}>
								<div className={styles.circle}></div>
								<p className={styles.item}>{item}</p>
							</Link>
						))}
					</div>
				</div>
				<div className={styles.dashboards}>
					<h2>Dashboards</h2>
					<Link href={'/'} className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0 }} />

						<ChartPie style={{ fill: '#484643' }} />
						<p>Home</p>
					</Link>

					<Link href={'/projects'} className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0 }} />
						<Projects style={{ fill: '#484643' }} />

						<p>Projects</p>
					</Link>
					<button
						className={styles.hor}
						onClick={() => setOpenClient(!openClient)}
					>
						<div className={`${styles.svg} ${openClient ? styles.rotate : ''}`}>
							<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
						</div>
						<Leads style={{ fill: '#484643' }} />
						<p>Clients</p>
					</button>
					<motion.ul
						animate={{
							height: openClient ? 'auto' : 0,
							opacity: openClient ? 1 : 0.2,
						}}
						initial={{ height: 0, opacity: 0.2, margin: '-2px 0' }}
						transition={{
							bounce: 0,
							duration: 0.2,
							ease: 'easeOut',
						}}
						style={{ overflow: 'hidden' }}
						className={styles.items}
					>
						<li>
							<Link href={'/clients'}>Overview</Link>
						</li>
						<li>
							<Link href={'/clients/leads'}>Leads</Link>
						</li>
					</motion.ul>
				</div>
				<div className={styles.dashboards}>
					<h2>Library</h2>
					<Link href={'/library'} className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0 }} />
						<Library style={{ fill: '#484643' }} />

						<p>Overview</p>
					</Link>
					{libraryItems.map((item, index) => (
						<Link
							href={`/library/category/${item.slug}`}
							className={styles.hor}
							key={index}
						>
							<Arrow style={{ fill: '#484643', opacity: 0 }} />
							<Library style={{ fill: '#484643' }} />

							<p>{item.slug}</p>
						</Link>
					))}
					<Link href={'/library/favorite'} className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0 }} />
						<Library style={{ fill: '#484643' }} />

						<p>Favorite</p>
					</Link>
					<Link href={'/notes'} className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0 }} />
						<Notes style={{ fill: '#484643' }} />

						<p>Notes</p>
					</Link>
					<Link href={'/social'} className={styles.hor}>
						<Arrow style={{ fill: '#484643', opacity: 0 }} />
						<Social style={{ fill: '#484643' }} />

						<p>Social</p>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SideBar;

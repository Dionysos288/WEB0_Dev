'use client';
import Image from 'next/image';
import styles from './SideBar.module.scss';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';
import ArrowLineRight from '@/svgs/ArrowLineRight';
import ChartPieSlice from '@/svgs/ChartPieSlice';
import Team from '@/svgs/Team';
import ShoppingBagOpen from '@/svgs/ShoppingBagOpen';
import Notebook from '@/svgs/Notebook';
import FolderV2 from '@/svgs/FolderV2';

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
						<ArrowLineRight fill="transparant" height="16" width="16" />

						<ChartPieSlice width="20" height="20" fill="var(--main)" />
						<p>Home</p>
					</Link>

					<Link href={'/projects'} className={styles.hor}>
						<ArrowLineRight fill="transparant" height="16" width="16" />

						<FolderV2 width="20" height="20" fill="var(--main)" />

						<p>Projects</p>
					</Link>
					<button
						className={styles.hor}
						onClick={() => setOpenClient(!openClient)}
					>
						<div className={`${styles.svg} ${openClient ? styles.rotate : ''}`}>
							<ArrowLineRight fill="var(--main-35)" height="16" width="16" />
						</div>

						<Team fill="var(--main)" width="20" height="20" />
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
						<ArrowLineRight fill="transparant" height="16" width="16" />

						<ShoppingBagOpen fill="var(--main)" width="20" height="20" />

						<p>Overview</p>
					</Link>
					{libraryItems.map((item, index) => (
						<Link
							href={`/library/category/${item.slug}`}
							className={styles.hor}
							key={index}
						>
							<ArrowLineRight fill="transparant" height="16" width="16" />

							<ShoppingBagOpen fill="var(--main)" width="20" height="20" />

							<p>{item.slug}</p>
						</Link>
					))}
					<Link href={'/library/favorite'} className={styles.hor}>
						<ArrowLineRight fill="transparant" height="16" width="16" />

						<ShoppingBagOpen fill="var(--main)" width="20" height="20" />

						<p>Favorite</p>
					</Link>
					<Link href={'/notes'} className={styles.hor}>
						<ArrowLineRight fill="transparant" height="16" width="16" />

						<Notebook fill="var(--main)" width="20" height="20" />

						<p>Notes</p>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SideBar;

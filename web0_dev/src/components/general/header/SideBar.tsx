'use client';
import Image from 'next/image';
import styles from './SideBar.module.scss';
import {
	Arrow,
	ChartPie,
	Library,
	Projects,
	Leads,
	Account,
	Notes,
	Social,
} from '@/svgs';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';

const SideBar = () => {
	const items = ['Overview', 'Projects'];
	const [favState, setFavState] = useState(true);
	const [openLibrary, setOpenLibrary] = useState(false);
	const [openClient, setOpenClient] = useState(false);
	const [openAccount, setOpenAccount] = useState(false);

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
					<button
						className={styles.hor}
						onClick={() => setOpenLibrary(!openLibrary)}
					>
						<div
							className={`${styles.svg} ${openLibrary ? styles.rotate : ''}`}
						>
							<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
						</div>
						<Library style={{ fill: '#484643' }} />

						<p>Library</p>
					</button>
					<motion.ul
						animate={{
							height: openLibrary ? 'auto' : 0,
							opacity: openLibrary ? 1 : 0.2,
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
							<Link href={'/library'}>Overview</Link>
						</li>
						<li>
							<Link href={'/library/code'}>Code</Link>
						</li>
						<li>
							<Link href={'/library/design'}>Design</Link>
						</li>
						<li>
							<Link href={'/library/favorites'}>Favorites</Link>
						</li>
					</motion.ul>

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
					<h2>Pages</h2>

					<button
						className={styles.hor}
						onClick={() => setOpenAccount(!openAccount)}
					>
						<div
							className={`${styles.svg} ${openAccount ? styles.rotate : ''}`}
						>
							<Arrow style={{ fill: '#484643', opacity: 0.3 }} />
						</div>
						<Account style={{ fill: '#484643' }} />

						<p>Account</p>
					</button>
					<motion.ul
						animate={{
							height: openAccount ? 'auto' : 0,
							opacity: openAccount ? 1 : 0.2,
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
							<Link href={'/account'}>Overview</Link>
						</li>
						<li>
							<Link href={'/account/settings'}>Settings</Link>
						</li>
						<li>
							<Link href={'/account/team'}>Team</Link>
						</li>
						<li>
							<Link href={'/account/billing'}>Billing</Link>
						</li>
					</motion.ul>
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

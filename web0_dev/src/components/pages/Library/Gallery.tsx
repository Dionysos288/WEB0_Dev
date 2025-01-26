'use client';
import styles from './Gallery.module.scss';
import { PlusRound, Bookmark, BookmarkFilled } from '@/svgs';
import Link from 'next/link';
import { ExtendedLibrary } from '@/components/types/types';
import Image from 'next/image';
import { makeFavorite } from '@/actions/CRUDLibrary';
import { useState } from 'react';

const Gallery = ({ data }: { data: ExtendedLibrary | ExtendedLibrary[] }) => {
	const items = Array.isArray(data) ? data : [data];
	const [favoriteStatus, setFavoriteStatus] = useState(
		items.reduce((acc, item) => {
			acc[item.id] = item.favorite;
			return acc;
		}, {} as { [key: string]: boolean })
	);

	const handleFavorite = async (id: string, favorite: boolean) => {
		setFavoriteStatus((prevStatus) => ({
			...prevStatus,
			[id]: !favorite,
		}));

		const result = await makeFavorite(id, favorite);

		if (result?.error) {
			setFavoriteStatus((prevStatus) => ({
				...prevStatus,
				[id]: favorite,
			}));
		}
	};
	return (
		<div className={styles.GalleryContainer}>
			{items.map((item) => (
				<div className={styles.item} key={item.id}>
					<div className={styles.GalleryItem}>
						<Link href={`/library/${item.id}`}>
							<Image
								src="https://placehold.co/24"
								alt="UserProfilePic"
								fill={true}
							/>
						</Link>
					</div>
					{item.Category && (
						<div className={styles.bannerLeft}>
							<p>{item.Category.name}</p>
						</div>
					)}
					<div className={styles.bannerRight}>
						<p>{item.component}</p>
					</div>
					<div className={styles.under}>
						<h3>{item.title}</h3>
						<div className={styles.svgs}>
							<button>
								<PlusRound />
							</button>
							<button
								onClick={() => handleFavorite(item.id, favoriteStatus[item.id])}
							>
								{favoriteStatus[item.id] ? (
									<BookmarkFilled
										style={{ fill: 'var(--main)', opacity: '0.9' }}
									/>
								) : (
									<Bookmark style={{ fill: 'var(--main)', opacity: '0.9' }} />
								)}
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Gallery;

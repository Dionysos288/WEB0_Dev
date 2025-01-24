import { Library } from '@prisma/client';
import styles from './Gallery.module.scss';
import { PlusRound, Bookmark } from '@/svgs';
import Link from 'next/link';
const Gallery = ({ data }: { data: Library[] | Library }) => {
	const items = Array.isArray(data) ? data : [data];
	return (
		<div className={styles.GalleryContainer}>
			{items.map((item) => (
				<Link
					href={`/library/${item.id}`}
					className={styles.item}
					key={item.id}
				>
					<div className={styles.GalleryItem}></div>
					<div className={styles.bannerLeft}>
						<p>{item.component}</p>
					</div>
					<div className={styles.bannerRight}>
						<p>{item.component}</p>
					</div>
					<div className={styles.under}>
						<h3>{item.title}</h3>
						<div className={styles.svgs}>
							<button>
								<PlusRound />
							</button>
							<button>
								<Bookmark style={{ fill: '#484643', opacity: '0.9' }} />
							</button>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};

export default Gallery;

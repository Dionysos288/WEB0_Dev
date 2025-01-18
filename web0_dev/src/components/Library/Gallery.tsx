import styles from './Gallery.module.scss';
import { PlusRound, Bookmark } from '@/svgs';
const Gallery = () => {
	const items = Array.from({ length: 8 });

	return (
		<div className={styles.GalleryContainer}>
			{items.map((_, index) => (
				<div className={styles.item} key={index}>
					<div className={styles.GalleryItem}></div>
					<div className={styles.banner}>
						<p>Websites</p>
					</div>
					<div className={styles.under}>
						<h3>Cool Button Hover</h3>
						<div className={styles.svgs}>
							<button>
								<PlusRound />
							</button>
							<button>
								<Bookmark style={{ fill: '#484643', opacity: '0.9' }} />
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Gallery;

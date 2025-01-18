import Image from 'next/image';
import styles from './GalleryV1.module.scss';
import Spacing from '@/components/General/Spacing';
const GalleryV1 = () => {
	return (
		<div className={styles.galleryWrapper}>
			<div className={styles.imgWrapper}>
				<Image
					src="https://placehold.co/500x200"
					alt="Cover Image Gallery"
					fill
					sizes="100vw"
				/>
			</div>
			<Spacing space={28} />
			<div className={styles.gallery}>
				{Array.from({ length: 6 }).map((_, index) => (
					<div key={index} className={styles.galleryItem}>
						<Image
							src="https://placehold.co/500x200"
							alt={`Image Gallery img ${index + 1}`}
							fill
							sizes="55vw"
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default GalleryV1;

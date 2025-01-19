import Image from 'next/image';
import styles from './EditHeader.module.scss';
import BackButton from '@/components/General/ui/buttons/BackButton';
import SVG from './SVG';
import { Edit } from '@/svgs';
interface HeaderProps {
	type?: string;
	name?: string;
	image?: boolean;
	admin?: boolean;
}

const EditHeader: React.FC<HeaderProps> = ({
	type,
	name,
	image = true,
	admin = false,
}) => {
	return (
		<div className={styles.headerWrapper}>
			<BackButton />
			<div className={styles.rightSide}>
				{image && (
					<>
						<p>{type} By</p>
						<div className={styles.imageWrapper}>
							<Image
								src="https://placehold.co/24"
								alt="UserProfilePic"
								width={24}
								height={24}
							/>
						</div>
						<p className={styles.name}>{name}</p>
					</>
				)}
				{admin && (
					<SVG>
						<Edit fill={'var(--main)'} opacity={'0.9'} />
					</SVG>
				)}
			</div>
		</div>
	);
};

export default EditHeader;

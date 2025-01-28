import Image from 'next/image';
import styles from './EditHeader.module.scss';
import SVG from './SVG';
import BackButton from './ui/buttons/BackButton';
import Edit from '@/svgs/Edit';
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
						<Edit fill={'var(--main-90)'} width="20" height="20" />
					</SVG>
				)}
			</div>
		</div>
	);
};

export default EditHeader;

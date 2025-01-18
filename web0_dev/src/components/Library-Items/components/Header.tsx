import Image from 'next/image';
import styles from './Header.module.scss';
import { ArrowLeft } from '@/svgs';
interface HeaderProps {
	type: string;
	name: string;
}

const Header: React.FC<HeaderProps> = ({ type, name }) => {
	return (
		<div className={styles.headerWrapper}>
			<button>
				<ArrowLeft style={{ fill: 'white' }} />
				<span>Go Back</span>
			</button>
			<div className={styles.rightSide}>
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
			</div>
		</div>
	);
};

export default Header;

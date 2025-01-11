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
				<h6>Go Back</h6>
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
				<h5>{name}</h5>
			</div>
		</div>
	);
};

export default Header;

import { ArrowLeft } from '@/svgs';
import styles from './BackButton.module.scss';
const BackButton = () => {
	return (
		<button className={styles.button}>
			<ArrowLeft style={{ fill: 'white' }} />
			<span>Go Back</span>
		</button>
	);
};

export default BackButton;

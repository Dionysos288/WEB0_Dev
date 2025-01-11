import Spacing from '@/components/general/Spacing';
import styles from './Colors.module.scss';
import { Clip } from '@/svgs';
import SVG from '@/components/general/SVG';
interface colorsProps {
	color: string[][];
}
const Colors: React.FC<colorsProps> = ({ color }) => {
	return (
		<div className={styles.colorWrapper}>
			<h4>Colors</h4>
			<Spacing space={10} />
			<div className={styles.colorContainer}>
				{color.map((item, index) => (
					<div key={index} className={styles.color}>
						<div
							className={styles.background}
							style={{ backgroundColor: item[1] }}
						/>
						<div className={styles.info}>
							<div className={styles.leftSide}>
								<h6>{item[0]}</h6>
								<p>{item[1]}</p>
							</div>
							<SVG>
								<Clip />
							</SVG>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Colors;

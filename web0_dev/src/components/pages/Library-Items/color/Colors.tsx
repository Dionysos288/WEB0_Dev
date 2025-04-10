import Spacing from '@/components/general/Spacing';
import styles from './Colors.module.scss';
import SVG from '@/components/general/SVG';
import ClipboardText from '@/svgs/ClipboardText';
interface colorsProps {
	color: string[][];
}
const Colors: React.FC<colorsProps> = ({ color }) => {
	return (
		<div className={styles.colorWrapper}>
			<h2>Colors</h2>
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
								<h3>{item[0]}</h3>
								<p>{item[1]}</p>
							</div>
							<SVG>
								<ClipboardText width="24" height="24" fill="var(--white)" />
							</SVG>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Colors;

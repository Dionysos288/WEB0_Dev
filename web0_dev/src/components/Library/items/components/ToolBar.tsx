import { BookmarkXL, Figma, Dependency } from '@/svgs';
import styles from './ToolBar.module.scss';

interface ToolbarProps {
	figma: boolean;
	dependency: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ figma, dependency }) => {
	return (
		<div className={styles.toolbarWrapper}>
			<div className={styles.leftSide}>
				<button className={styles.groupSvg}>
					<BookmarkXL fill={'var(--main)'} />
					<h6>Save To Favorites</h6>
				</button>
				{figma || dependency ? (
					<>
						<div className={styles.line} />
						{figma && (
							<button className={styles.groupSvg}>
								<Figma />
								<h6>Copy To Figma</h6>
							</button>
						)}
						{dependency && (
							<button className={styles.groupSvg}>
								<Dependency />
								<h6>Copy Dependencies</h6>
							</button>
						)}
					</>
				) : null}
			</div>
			<button className={styles.addButton}>
				<h6>Add To Project</h6>
			</button>
		</div>
	);
};

export default Toolbar;

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
					<span>Save To Favorites</span>
				</button>
				{figma || dependency ? (
					<>
						<div className={styles.line} />
						{figma && (
							<button className={styles.groupSvg}>
								<Figma />
								<span>Copy To Figma</span>
							</button>
						)}
						{dependency && (
							<button className={styles.groupSvg}>
								<Dependency />
								<span>Copy Dependencies</span>
							</button>
						)}
					</>
				) : null}
			</div>
			<button className={styles.addButton}>
				<span>Add To Project</span>
			</button>
		</div>
	);
};

export default Toolbar;

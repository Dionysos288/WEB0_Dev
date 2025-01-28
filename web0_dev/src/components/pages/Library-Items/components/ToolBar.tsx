import styles from './ToolBar.module.scss';
import BookmarkOutline from '@/svgs/Bookmark-Outline';
import ClipboardText from '@/svgs/ClipboardText';
import Figma from '@/svgs/Figma';

interface ToolbarProps {
	figma: boolean;
	dependency: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ figma, dependency }) => {
	return (
		<div className={styles.toolbarWrapper}>
			<div className={styles.leftSide}>
				<button className={styles.groupSvg}>
					<BookmarkOutline width="25" height="25" fill={'var(--main)'} />
					<span>Save To Favorites</span>
				</button>
				{figma || dependency ? (
					<>
						<div className={styles.line} />
						{figma && (
							<button className={styles.groupSvg}>
								<Figma width="25" height="25" fill="var(--main)" />
								<span>Copy To Figma</span>
							</button>
						)}
						{dependency && (
							<button className={styles.groupSvg}>
								<ClipboardText width="25" height="25" fill="var(--main)" />
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

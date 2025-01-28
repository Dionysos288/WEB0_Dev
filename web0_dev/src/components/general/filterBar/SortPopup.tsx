import {
	ExtendedLibrary,
	fileType,
	ModelNames,
	SortOptions,
} from '@/components/types/types';
import styles from './SortPopup.module.scss';

import { Library, Task } from '@prisma/client';
import { motion } from 'motion/react';
import { updateFilterLibrary } from '@/actions/CRUDLibrary';
import { updateFilterFiles } from '@/actions/CRUDFile';
import { updateFilterTasks } from '@/actions/CRUDTask';
import DatePicker from '@/svgs/DatePicker';
import Number from '@/svgs/Number';
import Text from '@/svgs/Text';

const SortPopup = ({
	isOpenSort,
	setIsOpenSort,
	setSortType,
	filters,
	favorite = false,
	query,
	id = '',
	phaseId = '',
	setData,
	model,
	options,
}: {
	isOpenSort: boolean;
	setIsOpenSort: React.Dispatch<React.SetStateAction<boolean>>;
	setSortType: React.Dispatch<React.SetStateAction<[SortOptions, boolean]>>;
	filters: string[];
	favorite?: boolean;
	query: string;
	id?: string;
	phaseId?: string;
	data: Library[] | fileType[] | Task[];
	setData: React.Dispatch<
		React.SetStateAction<ExtendedLibrary[] | fileType[] | Task[]>
	>;
	model: ModelNames;
	options: SortOptions[];
}) => {
	const handleSort = async (type: SortOptions, isAscending: boolean) => {
		const updatedData =
			model === 'library'
				? await updateFilterLibrary({
						selectedCategories: filters,
						favorite,
						id,
						type,
						query,
						isAscending,
				  })
				: model === 'file'
				? await updateFilterFiles({
						id,
						type,
						query,
						isAscending,
				  })
				: model === 'task'
				? await updateFilterTasks({
						id,
						phaseId,
						type,
						query,
						isAscending,
				  })
				: await updateFilterLibrary({
						selectedCategories: filters,
						favorite,
						id,
						type,
						query,
						isAscending,
				  });
		setData(updatedData.data);
		setSortType([type, isAscending]);
		setIsOpenSort(false);
	};

	return (
		<motion.div
			className={styles.sortOptions}
			initial={{ opacity: 0, scale: 0.85, y: 5 }}
			animate={{
				opacity: isOpenSort ? 1 : 0,
				scale: isOpenSort ? 1 : 0.85,
				y: isOpenSort ? 0 : 5,
			}}
			exit={{ opacity: 0, scale: 0.85, y: 5 }}
			transition={{
				duration: 0.2,
				bounce: 0,
				ease: [0.165, 0.084, 0.44, 1],
			}}
		>
			{options.includes('date') && (
				<>
					<div
						className={styles.button}
						onClick={() => handleSort('date', true)}
					>
						<div className={styles.leftSide}>
							<DatePicker fill="var(--main-80)" width="16" height="16" />

							<span>Date ( old - new )</span>
						</div>
						<div className={styles.rightSide}></div>
					</div>
					<div
						className={styles.button}
						onClick={() => handleSort('date', false)}
					>
						<div className={styles.leftSide}>
							<DatePicker fill="var(--main-80)" width="16" height="16" />

							<span>Date ( new - old )</span>
						</div>

						<div className={styles.rightSide}></div>
					</div>
				</>
			)}
			{options.includes('title') && (
				<>
					<div
						className={styles.button}
						onClick={() => handleSort('title', true)}
					>
						<div className={styles.leftSide}>
							<Text fill={'var(--main)'} width="16" height="16" />
							<span>Title ( A - Z )</span>
						</div>
						<div className={styles.rightSide}></div>
					</div>
					<div
						className={styles.button}
						onClick={() => handleSort('title', false)}
					>
						<div className={styles.leftSide}>
							<Text fill={'var(--main)'} width="16" height="16" />
							<span>Title ( Z - A )</span>
						</div>
						<div className={styles.rightSide}></div>
					</div>
				</>
			)}
			{options.includes('name') && (
				<>
					<div
						className={styles.button}
						onClick={() => handleSort('name', true)}
					>
						<div className={styles.leftSide}>
							<Text fill={'var(--main)'} width="16" height="16" />
							<span>Name ( A - Z )</span>
						</div>
						<div className={styles.rightSide}></div>
					</div>
					<div
						className={styles.button}
						onClick={() => handleSort('name', false)}
					>
						<div className={styles.leftSide}>
							<Text fill={'var(--main)'} width="16" height="16" />
							<span>Name ( Z - A )</span>
						</div>
						<div className={styles.rightSide}></div>
					</div>
				</>
			)}
			{options.includes('size') && (
				<>
					<div
						className={styles.button}
						onClick={() => handleSort('size', true)}
					>
						<div className={styles.leftSide}>
							<Number fill={'var(--main)'} width="16" height="16" />
							<span>Size ( small - big )</span>
						</div>
						<div className={styles.rightSide}></div>
					</div>
					<div
						className={styles.button}
						onClick={() => handleSort('size', false)}
					>
						<div className={styles.leftSide}>
							<Number fill={'var(--main)'} width="16" height="16" />
							<span>Size ( big - small )</span>
						</div>
						<div className={styles.rightSide}></div>
					</div>
				</>
			)}
			{options.includes('priority') && (
				<>
					<div
						className={styles.button}
						onClick={() => handleSort('priority', true)}
					>
						<div className={styles.leftSide}>
							<Text fill={'var(--main)'} width="16" height="16" />
							<span>Priority ( low - urgent )</span>
						</div>
						<div className={styles.rightSide}></div>
					</div>
					<div
						className={styles.button}
						onClick={() => handleSort('priority', false)}
					>
						<div className={styles.leftSide}>
							<Text fill={'var(--main)'} width="16" height="16" />
							<span>Priority ( urgent - low )</span>
						</div>
						<div className={styles.rightSide}></div>
					</div>
				</>
			)}
		</motion.div>
	);
};

export default SortPopup;

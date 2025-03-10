'use client';
import SVG from '../SVG';
import styles from './FilterBar.module.scss';
import { ChangeEvent, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Library, Phase, Task } from '@prisma/client';
import {
	ExtendedLibrary,
	fileType,
	ModelNames,
	SortOptions,
	ExtendedCategory,
} from '@/components/types/types';
import { updateFilterLibrary } from '@/actions/CRUDLibrary';
import { updateFilterFiles } from '@/actions/CRUDFile';
import { updateFilterTasks } from '@/actions/CRUDTask';
import ArrowLineRight from '@/svgs/ArrowLineRight';
import PlusStroke from '@/svgs/Plus-stroke';
import SortPopup from './SortPopup';
import FunnelSimple from '@/svgs/FunnelSimple';
import SortArrowsDownUp from '@/svgs/SortArrowsDownUp';
import Search from '@/svgs/Search';
import CloseCircleFilled from '@/svgs/Close-Circle-Filled';
import AddLibraryPopup from '@/components/pages/library/AddLibraryPopup';
import AddTaskPopup from '@/components/pages/project/tasks/AddTaskPopup';

interface FilterBarProps {
	title?: string;
	search?: boolean;
	setIsFilterOpenLibrary?: React.Dispatch<React.SetStateAction<boolean>>;
	isFilterOpenLibrary?: boolean;
	ExtraFilters?: string[];
	id?: string;
	phaseId?: string;
	data: Library[] | fileType[] | (Task & { phase?: Phase })[];
	setData: React.Dispatch<
		React.SetStateAction<
			ExtendedLibrary[] | fileType[] | (Task & { phase?: Phase })[]
		>
	>;
	favorite?: boolean;
	options: SortOptions[];
	setSortType: React.Dispatch<React.SetStateAction<[SortOptions, boolean]>>;
	sortType: [SortOptions, boolean];
	filters: string[];
	query: string;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	model: ModelNames;
	orgId?: string;
	categories?: ExtendedCategory[];
	projectId?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
	title,
	search = true,
	options,
	setSortType,
	favorite = false,
	sortType,
	data,
	setData,
	setIsFilterOpenLibrary,
	isFilterOpenLibrary,
	filters,
	query,
	setQuery,
	id = '',
	phaseId = '',
	model,
	ExtraFilters,
	orgId = '',
	categories = [],
	projectId = '',
}) => {
	const [isOpenSort, setIsOpenSort] = useState<boolean>(false);
	const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
	const [debouncedQuery, setDebouncedQuery] = useState<string>(query);
	const [isAddLibraryOpen, setIsAddLibraryOpen] = useState<boolean>(false);
	const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);

	const getQuery = (e: ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 300);
		return () => clearTimeout(handler);
	}, [query]);

	useEffect(() => {
		async function fetchData() {
			const updatedData =
				model === 'library'
					? await updateFilterLibrary({
							selectedCategories: filters,
							id,
							favorite,
							type: sortType[0],
							query: debouncedQuery,
							isAscending: sortType[1],
							organizationId: orgId,
					  })
					: model === 'file'
					? await updateFilterFiles({
							id,
							type: sortType[0],
							query: debouncedQuery,
							isAscending: sortType[1],
					  })
					: model === 'task'
					? await updateFilterTasks({
							id,
							type: sortType[0],
							query: debouncedQuery,
							phaseId: phaseId,
							isAscending: sortType[1],
					  })
					: await updateFilterLibrary({
							selectedCategories: filters,
							id,
							favorite,
							type: sortType[0],
							query: debouncedQuery,
							isAscending: sortType[1],
							organizationId: orgId,
					  });
			setData(updatedData.data);
		}
		fetchData();
	}, [
		debouncedQuery,
		filters,
		sortType,
		id,
		model,
		setData,
		favorite,
		phaseId,
		orgId,
	]);
	return (
		<>
			{title && <h2 className={styles.title}>{title}</h2>}
			<div className={styles.filterContainer}>
				<div className={styles.leftSide}>
					{model === 'library' && (
						<SVG onClick={() => setIsAddLibraryOpen(true)}>
							<PlusStroke fill="var(--main)" width="20" height="20" />
						</SVG>
					)}
					{model === 'task' && (
						<SVG onClick={() => setIsAddTaskOpen(true)}>
							<PlusStroke fill="var(--main)" width="20" height="20" />
						</SVG>
					)}
					{model !== 'library' && model !== 'task' && (
						<SVG>
							<PlusStroke fill="var(--main)" width="20" height="20" />
						</SVG>
					)}
					{ExtraFilters &&
						ExtraFilters.map((filter, index) => (
							<button key={index} className={styles.buttons}>
								{filter}
								<ArrowLineRight
									fill={'var(--main-80)'}
									width="16"
									height="16"
									style={{
										transform: 'translateY(1.5px)',
									}}
								/>
							</button>
						))}
					{setIsFilterOpenLibrary ? (
						<SVG onClick={() => setIsFilterOpenLibrary(!isFilterOpenLibrary)}>
							<FunnelSimple fill="var(--main)" width="20" height="20" />
						</SVG>
					) : (
						<SVG onClick={() => setIsFilterOpen(!isFilterOpen)}>
							<FunnelSimple fill="var(--main)" width="20" height="20" />
						</SVG>
					)}

					<SVG onClick={() => setIsOpenSort(!isOpenSort)}>
						<SortArrowsDownUp fill="var(--main)" width="20" height="20" />
						<AnimatePresence>
							{isOpenSort && (
								<SortPopup
									isOpenSort={isOpenSort}
									setIsOpenSort={setIsOpenSort}
									setSortType={setSortType}
									filters={filters}
									data={data}
									setData={setData}
									id={id}
									phaseId={phaseId}
									favorite={favorite}
									query={query}
									model={model}
									options={options}
								/>
							)}
						</AnimatePresence>
					</SVG>
				</div>
				{search && (
					<div className={styles.inputWrapper}>
						<input
							value={query}
							onChange={getQuery}
							className={styles.searchInput}
							type="text"
							placeholder="Search"
						/>
						<div className={styles.searchIcon}>
							<Search
								fill={'var(--main)'}
								style={query === '' ? {} : { opacity: '0.8' }}
							/>
						</div>
						<div
							className={`${styles.closeIcon} ${
								query === '' ? `${styles.closeSVG}` : `${styles.full}`
							}`}
							onClick={() => setQuery('')}
						>
							<CloseCircleFilled fill={'var(--main)'} width="16" height="16" />
						</div>
					</div>
				)}
			</div>

			{model === 'library' && (
				<AddLibraryPopup
					isOpen={isAddLibraryOpen}
					onClose={() => setIsAddLibraryOpen(false)}
					libraryTypeId={id}
					categories={categories}
					organizationId={orgId}
				/>
			)}

			{model === 'task' && (
				<AddTaskPopup
					isOpen={isAddTaskOpen}
					onClose={() => setIsAddTaskOpen(false)}
					projectId={projectId}
				/>
			)}
		</>
	);
};

export default FilterBar;

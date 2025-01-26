'use client';
import SVG from '../SVG';
import styles from './FilterBar.module.scss';
import { PlusXL, Filter, Sort, ArrowDown, Search, Views, Close } from '@/svgs';
import { ChangeEvent, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import SortPopup from './SortPopup';
import { Library, Task } from '@prisma/client';
import {
	ExtendedLibrary,
	fileType,
	ModelNames,
	SortOptions,
} from '@/components/types/types';
import { updateFilterLibrary } from '@/actions/CRUDLibrary';
import { updateFilterFiles } from '@/actions/CRUDFile';
import { updateFilterTasks } from '@/actions/CRUDTask';

interface FilterBarProps {
	title?: string;
	views?: boolean;
	search?: boolean;
	setIsFilterOpenLibrary?: React.Dispatch<React.SetStateAction<boolean>>;
	isFilterOpenLibrary?: boolean;
	ExtraFilters?: string[];
	id?: string;
	phaseId?: string;
	data: Library[] | fileType[] | Task[];
	setData: React.Dispatch<
		React.SetStateAction<ExtendedLibrary[] | fileType[] | Task[]>
	>;
	favorite?: boolean;
	options: SortOptions[];
	setSortType: React.Dispatch<React.SetStateAction<[SortOptions, boolean]>>;
	sortType: [SortOptions, boolean];
	filters: string[];
	query: string;
	setQuery: React.Dispatch<React.SetStateAction<string>>;
	model: ModelNames;
}
const FilterBar: React.FC<FilterBarProps> = ({
	title,
	views = false,
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
}) => {
	const [isOpenSort, setIsOpenSort] = useState<boolean>(false);
	const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
	const [debouncedQuery, setDebouncedQuery] = useState<string>(query);

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
	]);
	return (
		<>
			{title && <h2 className={styles.title}>{title}</h2>}
			<div className={styles.filterContainer}>
				<div className={styles.leftSide}>
					<SVG>
						<PlusXL style={{ fill: '#484643' }} />
					</SVG>
					{ExtraFilters &&
						ExtraFilters.map((filter, index) => (
							<button key={index} className={styles.buttons}>
								{filter}
								<ArrowDown
									style={{
										fill: '#484643',
										opacity: '0.8',
										transform: 'translateY(1.5px)',
									}}
								/>
							</button>
						))}
					{setIsFilterOpenLibrary ? (
						<SVG onClick={() => setIsFilterOpenLibrary(!isFilterOpenLibrary)}>
							<Filter style={{ fill: '#484643' }} />
						</SVG>
					) : (
						<SVG onClick={() => setIsFilterOpen(!isFilterOpen)}>
							<Filter style={{ fill: '#484643' }} />
						</SVG>
					)}

					<SVG onClick={() => setIsOpenSort(!isOpenSort)}>
						<Sort style={{ fill: '#484643' }} />
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

					{views && (
						<SVG>
							<Views style={{ fill: '#484643' }} />
						</SVG>
					)}
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
							<Close fill={'var(--main)'} />
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default FilterBar;

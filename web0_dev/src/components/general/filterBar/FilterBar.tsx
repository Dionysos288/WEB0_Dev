'use client';
import SVG from '../SVG';
import styles from './FilterBar.module.scss';
import { ChangeEvent, useEffect, useState, useRef } from 'react';
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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/actions/FileActions';
import { testUpload } from '@/utils/fileUtils';

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

// Define response type for upload operations
interface UploadResponse {
	data?: Record<string, unknown>;
	error?: string;
	success?: boolean;
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
	const [isDebugMode, setIsDebugMode] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

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

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return;

		const files = Array.from(e.target.files);
		const projectIdToUse = projectId || id;

		// If multiple files are being uploaded, show a summary toast
		if (files.length > 1) {
			toast.info(`Uploading ${files.length} files...`);
		}

		let successCount = 0;
		let failCount = 0;

		try {
			// Create an array of promises for all uploads
			const uploadPromises = files.map((file) => {
				const formData = new FormData();
				formData.append('file', file);
				formData.append('projectId', projectIdToUse);
				if (phaseId) formData.append('phaseId', phaseId);

				return toast.promise(
					// Add a timeout to prevent hanging uploads
					Promise.race([
						uploadFile(formData) as Promise<UploadResponse>,
						new Promise<UploadResponse>((_, reject) =>
							setTimeout(() => reject(new Error('Upload timed out')), 30000)
						),
					]),
					{
						loading: `Uploading ${file.name}...`,
						success: (response: UploadResponse) => {
							if (response.error) throw new Error(response.error);
							successCount++;
							return `${file.name} uploaded successfully`;
						},
						error: (error: Error) => {
							failCount++;
							return `Failed to upload ${file.name}: ${error.message}`;
						},
					}
				);
			});

			// Wait for all uploads to complete
			await Promise.allSettled(uploadPromises);

			// Show a summary toast after all uploads are done
			if (files.length > 1) {
				if (failCount === 0) {
					toast.success(`All ${files.length} files uploaded successfully!`);
				} else if (successCount === 0) {
					toast.error(`Failed to upload all ${files.length} files.`);
				} else {
					toast.info(
						`Uploaded ${successCount} of ${files.length} files. ${failCount} failed.`
					);
				}
			}

			// Refresh the page to show the new files
			router.refresh();
		} catch (error) {
			console.error('Upload error:', error);
		} finally {
			// Clear the file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const triggerFileUpload = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// Handle test upload for debugging
	const handleTestUpload = async () => {
		const projectIdToUse = projectId || id;

		if (!projectIdToUse) {
			toast.error('No project ID available for test upload');
			return;
		}

		const message = 'Test upload successful!';

		toast.promise(testUpload(projectIdToUse) as Promise<UploadResponse>, {
			loading: 'Testing upload functionality...',
			success: (response: UploadResponse) => {
				if (response.error) throw new Error(response.error);
				router.refresh();
				return message;
			},
			error: (error: Error) => `Test upload failed: ${error.message}`,
		});
	};

	// Add keyboard shortcut to toggle debug mode (Ctrl+Shift+D)
	const handleKeyDown = (e: globalThis.KeyboardEvent) => {
		if (e.ctrlKey && e.shiftKey && e.key === 'D') {
			e.preventDefault();
			setIsDebugMode((prev) => !prev);
			const message = isDebugMode
				? 'Debug mode disabled'
				: 'Debug mode enabled';
			toast.success(message);
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isDebugMode]);

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
					{model === 'file' && (
						<>
							<SVG onClick={triggerFileUpload}>
								<PlusStroke fill="var(--main)" width="20" height="20" />
							</SVG>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileUpload}
								style={{ display: 'none' }}
								multiple
							/>
							{isDebugMode && (
								<button className={styles.buttons} onClick={handleTestUpload}>
									Test Upload
								</button>
							)}
						</>
					)}
					{model !== 'library' && model !== 'task' && model !== 'file' && (
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

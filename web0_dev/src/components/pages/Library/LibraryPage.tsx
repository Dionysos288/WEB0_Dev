'use client';
import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import TopMenu from '@/components/general/TopMenu';
import Gallery from './Gallery';
import FilterSideBar from './FilterSideBar';
import { useState, useEffect } from 'react';
import {
	ExtendedLibrary,
	LibraryData,
	SortOptions,
	fileType,
} from '@/components/types/types';
import BigButton from './BigButtons';
import { Phase, Project, Task } from '@prisma/client';
import { usePathname } from 'next/navigation';

const LibraryPage = ({
	homePage = false,
	projectPage = false,
	menuItems,
	menuLinks,
	favorite = false,
	libraryData,
	projects,
	slug,
	orgId,
}: {
	homePage?: boolean;
	projectPage?: boolean;
	menuItems?: string[];
	menuLinks?: string[];
	favorite?: boolean;
	slug: string;
	libraryData: LibraryData | LibraryData[];
	orgId: string;
	projects: Project[];
}) => {
	const pathname = usePathname();

	useEffect(() => {
		if (projectPage && projects.length > 0) {
			const pageInfoEvent = new CustomEvent('pageinfo', {
				detail: {
					id: pathname.split('/').pop() || '',
					title: `Library: ${projects[0].title || 'Project Library'}`,
					type: 'library',
					pathname: pathname,
				},
			});
			window.dispatchEvent(pageInfoEvent);
		} else {
			const pageInfoEvent = new CustomEvent('pageinfo', {
				detail: {
					id: 'library',
					title: 'Library',
					type: 'library',
					pathname: pathname,
				},
			});
			window.dispatchEvent(pageInfoEvent);
		}
	}, [pathname, projectPage, projects]);

	const [galleryData, setGalleryData] = useState<ExtendedLibrary[]>(
		Array.isArray(libraryData)
			? libraryData.flatMap((data) => data.libraries)
			: libraryData.libraries
	);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [query, setQuery] = useState('');
	const [sortType, setSortType] = useState<[SortOptions, boolean]>([
		'date',
		false,
	]);
	const id = Array.isArray(libraryData) ? undefined : libraryData.id;
	console.log(galleryData);

	return (
		<>
			<FilterSideBar
				data={libraryData}
				setData={setGalleryData}
				favorite={favorite}
				setIsFilterOpen={setIsFilterOpen}
				isFilterOpen={isFilterOpen}
				selectedCategories={selectedCategories}
				setSelectedCategories={setSelectedCategories}
				query={query}
				sortType={sortType}
				organizationId={orgId}
			/>
			{!projectPage && menuItems && menuLinks && (
				<TopMenu
					menuItems={menuItems}
					menuLinks={menuLinks}
					AddItem={'Add Asset'}
				/>
			)}

			{homePage && (
				<>
					<BigButton />
					<Spacing space={28} />
				</>
			)}

			<FilterBar
				options={['date', 'title']}
				data={galleryData}
				setData={
					setGalleryData as React.Dispatch<
						React.SetStateAction<
							ExtendedLibrary[] | fileType[] | (Task & { phase?: Phase })[]
						>
					>
				}
				model={'library'}
				setIsFilterOpenLibrary={setIsFilterOpen}
				isFilterOpenLibrary={isFilterOpen}
				setQuery={setQuery}
				query={query}
				id={id}
				favorite={favorite}
				filters={selectedCategories}
				sortType={sortType}
				setSortType={setSortType}
				orgId={orgId}
				categories={
					Array.isArray(libraryData)
						? libraryData.flatMap((lib) => lib.categories || [])
						: libraryData.categories || []
				}
			/>
			<Spacing space={28} />
			<Gallery data={galleryData} slug={slug} projects={projects} />
		</>
	);
};

export default LibraryPage;

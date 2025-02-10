'use client';
import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import TopMenu from '@/components/general/TopMenu';
import Gallery from './Gallery';
import FilterSideBar from './FilterSideBar';
import { useState } from 'react';
import {
	ExtendedLibrary,
	LibraryData,
	SortOptions,
} from '@/components/types/types';
import BigButton from './BigButtons';

const LibraryPage = ({
	homePage = false,
	projectPage = false,
	menuItems,
	menuLinks,
	favorite = false,
	libraryData,
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
}) => {
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
				setData={setGalleryData}
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
			/>
			<Spacing space={28} />
			<Gallery data={galleryData} slug={slug} />
		</>
	);
};

export default LibraryPage;

'use client';
import FilterBar from '@/components/General/filterBar/FilterBar';
import Spacing from '@/components/General/Spacing';
import TopMenu from '@/components/General/TopMenu';
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
}: {
	homePage?: boolean;
	projectPage?: boolean;
	menuItems?: string[];
	menuLinks?: string[];
	favorite?: boolean;
	libraryData: LibraryData | LibraryData[];
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
			/>
			{!projectPage && menuItems && menuLinks && (
				<TopMenu
					mainLink="library"
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
			/>
			<Spacing space={28} />
			<Gallery data={galleryData} />
		</>
	);
};

export default LibraryPage;

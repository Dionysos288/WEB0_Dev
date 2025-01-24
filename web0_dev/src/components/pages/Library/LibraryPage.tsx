'use client';
import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';
import TopMenu from '@/components/General/TopMenu';
import Gallery from './Gallery';
import { Category, Library, LibraryType } from '@prisma/client';
import FilterSideBar from './FilterSideBar';
import { useState } from 'react';
type ExtendedCategory = Category & { subcategories: ExtendedCategory[] };

const LibraryPage = ({
	menuItems,
	menuLinks,
	libraryData,
}: {
	menuItems: string[];
	menuLinks: string[];
	libraryData: LibraryType & {
		categories: ExtendedCategory[];
		libraries: Library[];
	};
}) => {
	const [galleryData, setGalleryData] = useState(libraryData.libraries);
	return (
		<>
			<FilterSideBar data={libraryData} setData={setGalleryData} />
			<TopMenu
				mainLink="library"
				menuItems={menuItems}
				menuLinks={menuLinks}
				AddItem={'Add Asset'}
			/>
			<FilterBar />
			<Spacing space={28} />
			<Gallery data={galleryData} />
		</>
	);
};

export default LibraryPage;

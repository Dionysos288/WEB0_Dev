import Gallery from '@/components/Library/Gallery';
import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';
import TopMenu from '@/components/General/TopMenu';

export default function CodePage() {
	return (
		<>
			<TopMenu
				menuItems={['Overview', 'Code', 'Design', 'Favorites']}
				AddItem={'Add Asset'}
			/>
			<FilterBar
				ExtraFilters={['Technology', 'Components', 'Animations', 'Sections']}
			/>
			<Spacing space={28} />
			<Gallery />
		</>
	);
}

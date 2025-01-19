import Gallery from '@/components/pages/Library/Gallery';
import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';
import TopMenu from '@/components/General/TopMenu';

export default function FavoritesPage() {
	return (
		<>
			<TopMenu
				menuItems={['Overview', 'Code', 'Design', 'Favorites']}
				AddItem={'Add Asset'}
			/>
			<FilterBar />
			<Spacing space={28} />
			<Gallery />
		</>
	);
}

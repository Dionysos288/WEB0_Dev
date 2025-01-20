import Gallery from '@/components/pages/Library/Gallery';
import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';
import TopMenu from '@/components/General/TopMenu';

export default function Page() {
	return (
		<>
			<TopMenu
				mainLink="library"
				menuItems={['Overview', 'Code', 'Design', 'Favorites']}
				AddItem={'Add Asset'}
				foundLink="favorites"
			/>
			<FilterBar />
			<Spacing space={28} />
			<Gallery />
		</>
	);
}

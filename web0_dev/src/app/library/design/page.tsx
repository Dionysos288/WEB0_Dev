import Gallery from '@/components/Library/Gallery';
import FilterBar from '@/components/general/FilterBar';
import Spacing from '@/components/general/Spacing';
import TopMenu from '@/components/general/TopMenu';

export default function DesignPage() {
	return (
		<>
			<TopMenu
				menuItems={['Overview', 'Code', 'Design', 'Favorites']}
				AddItem={'Add Asset'}
			/>
			<FilterBar ExtraFilters={['Websites', 'Colors', 'Fonts', 'Assets']} />
			<Spacing space={28} />
			<Gallery />
		</>
	);
}

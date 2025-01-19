import BigButton from '@/components/pages/Library/BigButtons';
import Gallery from '@/components/pages/Library/Gallery';
import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';

export default function LibraryPage() {
	return (
		<>
			<BigButton />
			<Spacing space={28} />
			<FilterBar title="All Assets" />
			<Spacing space={28} />
			<Gallery />
		</>
	);
}

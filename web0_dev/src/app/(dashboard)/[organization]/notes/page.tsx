// import FilterBar from '@/components/general/filterBar/FilterBar';
import Spacing from '@/components/general/Spacing';
import NoteGallery from '@/components/pages/notes/NoteGallery';

export default function NotesPage() {
	return (
		<>
			{/* <FilterBar title="My Notes" /> */}
			<Spacing space={28} />
			<NoteGallery />
		</>
	);
}

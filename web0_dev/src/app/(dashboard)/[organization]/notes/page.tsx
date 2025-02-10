// import FilterBar from '@/components/General/filterBar/FilterBar';
import Spacing from '@/components/General/Spacing';
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

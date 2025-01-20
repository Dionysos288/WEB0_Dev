import FilterBar from '@/components/General/FilterBar';
import Spacing from '@/components/General/Spacing';
import NoteGallery from '@/components/pages/notes/NoteGallery';
import { folders, notes } from '@/Data/Notes';

export default function NotesPage() {
	return (
		<>
			<FilterBar title="My Notes" />
			<Spacing space={28} />
			<NoteGallery notes={notes} folders={folders} />
		</>
	);
}

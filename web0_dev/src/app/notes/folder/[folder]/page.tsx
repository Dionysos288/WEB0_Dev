import type { Metadata } from 'next';
import Spacing from '@/components/General/Spacing';
import FilterBar from '@/components/General/FilterBar';
import NoteGallery from '@/components/pages/notes/NoteGallery';
import { folders, notes } from '@/Data/Notes';

export async function generateMetadata({
	params,
}: {
	params: { folder: string };
}): Promise<Metadata> {
	return {
		title: `${params} | Web0`,
		description: `View ${params} on Web0`,
	};
}
const page = async ({ params }: { params: { folder: string } }) => {
	const notesData = notes.filter(
		(note) => note.folderId === parseInt(params.folder)
	);
	if (notesData) {
		return (
			<>
				<FilterBar title="My Notes" />
				<Spacing space={28} />
				<NoteGallery notes={notesData} folders={folders} inFolder={true} />
			</>
		);
	}
};

export default page;

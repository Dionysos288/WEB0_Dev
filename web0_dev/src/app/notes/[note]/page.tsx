import type { Metadata } from 'next';
import Spacing from '@/components/General/Spacing';
import { notes } from '@/Data/Notes';
import EditHeader from '@/components/General/EditHeader';
import NoteHeader from '@/components/pages/notes/note/NoteHeader';
import FileEditing from '@/components/pages/notes/note/FileEditing';

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
const page = async ({ params }: { params: { note: string } }) => {
	const notesData = notes.filter((note) => note.id === parseInt(params.note));
	if (notesData) {
		return (
			<>
				<EditHeader admin={true} image={false} />
				<Spacing space={28} />
				<NoteHeader
					title={notesData[0].title}
					description={notesData[0].content}
				/>
				<Spacing space={28} />

				<FileEditing note={notesData[0]} />
			</>
		);
	}
};

export default page;

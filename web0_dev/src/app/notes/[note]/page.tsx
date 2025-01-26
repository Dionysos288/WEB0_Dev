import type { Metadata } from 'next';
import Spacing from '@/components/General/Spacing';
import EditHeader from '@/components/General/EditHeader';
import NoteHeader from '@/components/pages/notes/note/NoteHeader';
import FileEditing from '@/components/pages/notes/note/FileEditing';
import prisma from '@/lib/db';

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
	const { note } = await params;

	const notesData = await prisma.note.findUnique({
		where: {
			id: note,
		},
	});
	if (notesData) {
		return (
			<>
				<EditHeader admin={true} image={false} />
				<Spacing space={28} />
				<NoteHeader
					title={notesData.title}
					description={notesData.description || undefined}
				/>
				<Spacing space={28} />

				<FileEditing note={notesData} />
			</>
		);
	}
};

export default page;

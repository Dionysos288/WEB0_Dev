import type { Metadata } from 'next';
import Spacing from '@/components/General/Spacing';
import FilterBar from '@/components/General/FilterBar';
import NoteGallery from '@/components/pages/notes/NoteGallery';
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
const page = async ({ params }: { params: { folder: string } }) => {
	const Folder = await prisma.folder.findUnique({
		where: {
			id: params.folder,
		},
		include: {
			notes: true,
		},
	});
	if (Folder) {
		return (
			<>
				<FilterBar title="My Notes" />
				<Spacing space={28} />
				<NoteGallery
					notesData={Folder.notes}
					foldersData={Folder}
					inFolder={true}
				/>
			</>
		);
	}
};

export default page;

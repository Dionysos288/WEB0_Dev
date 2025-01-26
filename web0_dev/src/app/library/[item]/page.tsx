import CodeFullPage from '@/components/pages/Library-Items/code/CodeFullPage';
import CodeSplitPage from '@/components/pages/Library-Items/code/CodeSplitPage';
import ColorPage from '@/components/pages/Library-Items/color/ColorPage';
import ImageV1Page from '@/components/pages/Library-Items/gallery/ImageV1Page';
import ImageV2Page from '@/components/pages/Library-Items/gallery/ImageV2Page';
import prisma from '@/lib/db';
import type { Metadata } from 'next';

export async function generateMetadata({
	params,
}: {
	params: { item: string };
}): Promise<Metadata> {
	return {
		title: `${params} | Web0`,
		description: `View ${params} on Web0`,
	};
}
const page = async ({ params }: { params: { item: string } }) => {
	const { item } = await params;
	const libraryItem = await prisma.library.findUnique({
		where: {
			id: item,
		},
	});
	if (libraryItem) {
		if (libraryItem.component === 'imageV1') {
			return <ImageV1Page />;
		} else if (libraryItem.component === 'imageV2') {
			return <ImageV2Page />;
		} else if (libraryItem.component === 'color') {
			return <ColorPage />;
		} else if (libraryItem.component === 'codefull') {
			return <CodeFullPage />;
		} else if (libraryItem.component === 'codeSplit') {
			return <CodeSplitPage />;
		}
	}
	return null;
};

export default page;

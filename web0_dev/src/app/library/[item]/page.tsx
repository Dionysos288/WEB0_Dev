import CodeFullPage from '@/components/pages/Library-Items/code/CodeFullPage';
import CodeSplitPage from '@/components/pages/Library-Items/code/CodeSplitPage';
import ColorPage from '@/components/pages/Library-Items/color/ColorPage';
import ImageV1Page from '@/components/pages/Library-Items/gallery/ImageV1Page';
import ImageV2Page from '@/components/pages/Library-Items/gallery/ImageV2Page';
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
const page = ({ params }: { params: { item: string } }) => {
	if (params.item === 'imageV1') {
		return <ImageV1Page />;
	} else if (params.item === 'imageV2') {
		return <ImageV2Page />;
	} else if (params.item === 'color') {
		return <ColorPage />;
	} else if (params.item === 'codefull') {
		return <CodeFullPage />;
	} else if (params.item === 'codeSplit') {
		return <CodeSplitPage />;
	}
};

export default page;

import EditHeader from '@/components/general/EditHeader';
import Spacing from '@/components/general/Spacing';
import GalleryV2 from '@/components/pages/library-items/gallery/GalleryV2';
import Toolbar from '@/components/pages/library-items/components/ToolBar';
import Colors from '@/components/pages/library-items/color/Colors';
import { Library } from '@prisma/client';
interface LibraryMetadata {
	images?: string[];
	colors?: string[][];
}
const ColorPage = ({ item }: { item: Library }) => {
	const metadata = item.metadata as unknown as LibraryMetadata;
	const images = metadata?.images || [];
	const colors = metadata?.colors || [];
	return (
		<>
			<EditHeader type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<GalleryV2 images={images} />
			<Spacing space={28} />
			<Colors color={colors} />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={false} />
		</>
	);
};

export default ColorPage;

import Spacing from '@/components/general/Spacing';
import EditHeader from '@/components/general/EditHeader';
import Toolbar from '../components/ToolBar';
import GalleryV1 from './GalleryV1';
import { Library } from '@prisma/client';
interface LibraryMetadata {
	images?: string[];
}
const ImageV1Page = ({ item }: { item: Library }) => {
	const metadata = item.metadata as unknown as LibraryMetadata;
	const images = metadata?.images || [];
	return (
		<>
			<EditHeader type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<GalleryV1 images={images} />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={false} />
		</>
	);
};

export default ImageV1Page;

import Spacing from '@/components/general/Spacing';
import EditHeader from '@/components/general/EditHeader';
import Toolbar from '../components/ToolBar';
import GalleryV2 from './GalleryV2';
import { Library } from '@prisma/client';
interface LibraryMetadata {
	images?: string[];
  }
const ImageV2Page = ({ item }: { item: Library }) => {
	const metadata = item.metadata as unknown as LibraryMetadata;
	const images = metadata?.images || [];
	return (
		<>
			<EditHeader type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<GalleryV2 images={images} />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={false} />
		</>
	);
};

export default ImageV2Page;

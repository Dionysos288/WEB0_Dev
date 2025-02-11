import Spacing from '@/components/general/Spacing';
import EditHeader from '@/components/general/EditHeader';
import Toolbar from '../components/ToolBar';
import GalleryV1 from './GalleryV1';

const ImageV1Page = () => {
	return (
		<>
			<EditHeader type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<GalleryV1 />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={false} />
		</>
	);
};

export default ImageV1Page;

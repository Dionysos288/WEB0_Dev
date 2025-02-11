import Spacing from '@/components/general/Spacing';
import EditHeader from '@/components/general/EditHeader';
import Toolbar from '../components/ToolBar';
import GalleryV2 from './GalleryV2';

const ImageV2Page = () => {
	return (
		<>
			<EditHeader type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<GalleryV2 />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={false} />
		</>
	);
};

export default ImageV2Page;

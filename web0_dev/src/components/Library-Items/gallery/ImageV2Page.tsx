import Spacing from '@/components/General/Spacing';
import Header from '@/components/Library-Items/components/Header';
import Toolbar from '../components/ToolBar';
import GalleryV2 from './GalleryV2';

const ImageV2Page = () => {
	return (
		<>
			<Header type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<GalleryV2 />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={false} />
		</>
	);
};

export default ImageV2Page;

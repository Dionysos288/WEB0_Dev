import Spacing from '@/components/general/Spacing';
import Header from '@/components/Library/items/components/Header';
import Toolbar from './components/ToolBar';
import GalleryV1 from './components/GalleryV1';

const ImageV1Page = () => {
	return (
		<>
			<Header type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<GalleryV1 />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={false} />
		</>
	);
};

export default ImageV1Page;

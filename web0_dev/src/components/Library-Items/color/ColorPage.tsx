import Header from './components/Header';
import Spacing from '@/components/General/Spacing';
import GalleryV2 from './components/GalleryV2';
import Toolbar from './components/ToolBar';
import Colors from './components/Colors';

const ColorPage = () => {
	const color = [
		['White', '#FFFFFF'],
		['Black', '#000000'],
		['Pink', '#F34141'],
		['Nude', '#FBBC55'],
		['Green', '#53B483'],
	];
	return (
		<>
			<Header type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<GalleryV2 />
			<Spacing space={28} />
			<Colors color={color} />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={false} />
		</>
	);
};

export default ColorPage;

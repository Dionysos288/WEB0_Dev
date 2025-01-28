import EditHeader from '@/components/General/EditHeader';
import Spacing from '@/components/General/Spacing';
import GalleryV2 from '@/components/pages/library-items/gallery/GalleryV2';
import Toolbar from '@/components/pages/library-items/components/ToolBar';
import Colors from '@/components/pages/library-items/color/Colors';

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
			<EditHeader type="Image" name="Dion Zeneli" />
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

import Spacing from '@/components/General/Spacing';
import EditorScreen from './EditorScreen';
import Toolbar from '../components/ToolBar';
import Header from '@/components/Library-Items/components/Header';

const CodeFullPage = () => {
	return (
		<>
			<Header type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<EditorScreen fullscreen={true} />
			<Spacing space={28} />

			<Toolbar figma={false} dependency={true} />
		</>
	);
};

export default CodeFullPage;

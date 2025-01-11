import Spacing from '@/components/general/Spacing';
import EditorScreen from './components/EditorScreen';
import Toolbar from './components/ToolBar';
import Header from '@/components/Library/items/components/Header';

const CodeFullPage = () => {
	return (
		<>
			<Header type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<EditorScreen fullscreen={true} />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={true} />
		</>
	);
};

export default CodeFullPage;

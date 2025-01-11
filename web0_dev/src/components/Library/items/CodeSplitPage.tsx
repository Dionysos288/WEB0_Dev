import Header from '@/components/Library/items/components/Header';
import Toolbar from './components/ToolBar';
import Spacing from '@/components/general/Spacing';
import Editor from './components/EditorScreen';

const CodeSplitPage = () => {
	return (
		<>
			<Header type="Image" name="Dion Zeneli" />
			<Spacing space={28} />
			<Editor fullscreen={false} />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={true} />
		</>
	);
};

export default CodeSplitPage;

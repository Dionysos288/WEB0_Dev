import Header from '@/components/Library-Items/components/Header';
import Toolbar from '../components/ToolBar';
import Spacing from '@/components/General/Spacing';
import Editor from './EditorScreen';

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

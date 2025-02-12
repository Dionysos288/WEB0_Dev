import EditHeader from '@/components/general/EditHeader';
import Toolbar from '../components/ToolBar';
import Spacing from '@/components/general/Spacing';
import Editor from './EditorScreen';

const CodeSplitPage = () => {
	return (
		<>
			<EditHeader type="Image" name="Dion Zeneli" admin={true} />
			<Spacing space={28} />
			<Editor fullscreen={false} />
			<Spacing space={28} />

			<Toolbar figma={true} dependency={true} />
		</>
	);
};

export default CodeSplitPage;

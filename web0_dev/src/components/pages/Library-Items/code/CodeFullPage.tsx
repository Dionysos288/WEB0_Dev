import Spacing from '@/components/General/Spacing';
import EditorScreen from './EditorScreen';
import Toolbar from '../components/ToolBar';
import EditHeader from '@/components/General/EditHeader';

const CodeFullPage = () => {
	return (
		<>
			<EditHeader type="Image" name="Dion Zeneli" admin={true} />
			<Spacing space={28} />
			<EditorScreen fullscreen={true} />
			<Spacing space={28} />

			<Toolbar figma={false} dependency={true} />
		</>
	);
};

export default CodeFullPage;

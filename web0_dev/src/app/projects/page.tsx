import Spacing from '@/components/General/Spacing';
import BigButtons from '@/components/pages/Projects/BigButtons';
import ProjectGallery from '@/components/pages/Projects/ProjectGallery';

export default function LibraryPage() {
	return (
		<>
			<BigButtons />
			<Spacing space={28} />
			<ProjectGallery />
		</>
	);
}

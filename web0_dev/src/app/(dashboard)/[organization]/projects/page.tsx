import Spacing from '@/components/general/Spacing';
import BigButtons from '@/components/pages/projects/BigButtons';
import ProjectGallery from '@/components/pages/projects/ProjectGallery';

export default function LibraryPage() {
	return (
		<>
			<BigButtons />
			<Spacing space={28} />
			<ProjectGallery />
		</>
	);
}

import Spacing from '@/components/general/Spacing';
import BigButtons from '@/components/Projects/BigButtons';
import ProjectGallery from '@/components/Projects/ProjectGallery';

export default function LibraryPage() {
	return (
		<>
			<BigButtons />
			<Spacing space={28} />
			<ProjectGallery />
		</>
	);
}

import { ExtendedCategory } from '@/components/types/types';

export interface AddLibraryPopupProps {
	isOpen: boolean;
	onClose: () => void;
	categories: ExtendedCategory[];
	organizationId: string;
	libraryTypeId: string;
	projectId?: string;
	libraryTags?: string[];
}

export interface LibraryTypeOption {
	id: string;
	name: string;
	description: string;
	icon: React.ComponentType<{
		fill?: string;
		width?: string;
		height?: string;
	}>;
	category: 'code' | 'design';
}

export interface LanguageOption {
	id: string;
	name: string;
	extension: string;
	mode: string;
}

export interface FileGroup {
	name: string;
	files: {
		name: string;
		type: string;
		description?: string;
	}[];
}

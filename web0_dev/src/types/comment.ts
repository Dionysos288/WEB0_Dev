export interface Comment {
	id: string;
	content: string;
	createdAt: Date;
	author: {
		user: {
			name: string;
			id: string;
			createdAt: Date;
			updatedAt: Date;
			email: string;
			emailVerified: boolean;
			image: string | null;
		};
	};
}

export interface ActivityWithUser {
	id: string;
	type: string;
	description: string;
	createdAt: Date;
	actor: {
		user: {
			name: string;
			image: string | null;
		};
	};
}

export interface TaskUpdateData {
	assignees?: { connect: { id: string }[] } | { disconnect: { id: string }[] };
	labels?: { connect: { id: string }[] } | { disconnect: { id: string }[] };
	phaseId?: string | null;
	[key: string]: any;
}

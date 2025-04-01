import type { Metadata } from 'next';
import WorkspacePage from '@/components/pages/settings/administration/workspace/WorkspacePage';
import { getUser } from '@/actions/AccountActions';
export async function generateMetadata(): Promise<Metadata> {
	return {
		title: `Workspace `,
		description: `View Workspace on Web0`,
	};
}
const page = async () => {
	const { data: session } = await getUser();
	console.log(session);
	const orgId = session?.session.organizationId;
	console.log(orgId);
	return <WorkspacePage orgId={orgId} />;
};

export default page;

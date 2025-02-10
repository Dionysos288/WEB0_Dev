import TopMenu from '@/components/general/TopMenu';
import { getUser } from '@/actions/AccountActions';
import ServerClientGallery from '@/components/server/ServerClientGallery';

export default async function LibraryPage() {
	const { data: session } = await getUser();
	const organizationSlug = session?.session.organizationSlug;
	return (
		<>
			<TopMenu
				menuItems={['Overview', 'Leads']}
				menuLinks={[
					`${organizationSlug}/clients`,
					`${organizationSlug}/clients/leads`,
				]}
				AddItem="Add User"
				foundLink="leads"
			/>

			<ServerClientGallery session={session} />
		</>
	);
}

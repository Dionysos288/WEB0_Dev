import prisma from '@/lib/db';
import ClientGallery from '../pages/clients/leads/ClientGallery';
import { Session } from '@/lib/auth';

const ServerClientGallery = async ({ session }: { session: Session }) => {
	const clients = await prisma.client.findMany({
		where: {
			organizationId: session?.session.activeOrganizationId,
		},
	});
	return <ClientGallery TasksData={clients} />;
};

export default ServerClientGallery;

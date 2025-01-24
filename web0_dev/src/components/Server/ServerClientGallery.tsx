import prisma from '@/lib/db';
import ClientGallery from '../pages/clients/leads/ClientGallery';

const ServerClientGallery = async () => {
	const clients = await prisma.client.findMany();
	return <ClientGallery TasksData={clients} />;
};

export default ServerClientGallery;

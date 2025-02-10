import TableData from '@/components/general/ui/TableData';
import { TableHeader } from '@/components/types/types';
import { Session } from '@/lib/auth';
import prisma from '@/lib/db';

const ServerTableData = async ({
	tableHeaders,
	session,
}: {
	tableHeaders: TableHeader[];
	session: Session;
}) => {
	const clients = await prisma.client.findMany({
		where: {
			organizationId: session?.session.organizationId,
		},
	});
	return (
		<TableData type="clients" tableHeaders={tableHeaders} tableData={clients} />
	);
};

export default ServerTableData;

import TableData from '@/components/General/ui/TableData';
import { TableHeader } from '@/components/types/types';
import prisma from '@/lib/db';

const ServerTableData = async ({
	tableHeaders,
}: {
	tableHeaders: TableHeader[];
}) => {
	const clients = await prisma.client.findMany();
	return (
		<TableData type="clients" tableHeaders={tableHeaders} tableData={clients} />
	);
};

export default ServerTableData;

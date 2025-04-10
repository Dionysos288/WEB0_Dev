import { Icon } from '@/components/editor/components/Icon';
import { Surface } from '@/components/editor/components/Surface';
import { Toolbar } from '@/components/editor/components/Toolbar';
import Tooltip from '@/components/editor/components/Tooltip';
import styles from './LinkPreviewPanel.module.scss';

export type LinkPreviewPanelProps = {
	url: string;
	onEdit: () => void;
	onClear: () => void;
};

export const LinkPreviewPanel = ({
	onClear,
	onEdit,
	url,
}: LinkPreviewPanelProps) => {
	const sanitizedLink = url?.startsWith('javascript:') ? '' : url;
	return (
		<Surface className={styles.container}>
			<a
				href={sanitizedLink}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.link}
			>
				{url}
			</a>
			<Toolbar.Divider />
			<Tooltip title="Edit link">
				<Toolbar.Button onClick={onEdit}>
					<Icon name="Pen" />
				</Toolbar.Button>
			</Tooltip>
			<Tooltip title="Remove link">
				<Toolbar.Button onClick={onClear}>
					<Icon name="Trash2" />
				</Toolbar.Button>
			</Tooltip>
		</Surface>
	);
};

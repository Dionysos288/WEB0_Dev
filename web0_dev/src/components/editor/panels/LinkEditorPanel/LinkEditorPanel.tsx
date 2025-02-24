import { Button } from '@/components/editor/components/Button/Button';
import { Icon } from '@/components/editor/components/Icon';
import { Surface } from '@/components/editor/components/Surface';
import { Toggle } from '@/components/editor/components/Toggle/Toggle';
import { useState, useCallback, useMemo } from 'react';
import styles from './LinkEditorPanel.module.scss';

export type LinkEditorPanelProps = {
	initialUrl?: string;
	initialOpenInNewTab?: boolean;
	onSetLink: (url: string, openInNewTab?: boolean) => void;
};

export const useLinkEditorState = ({
	initialUrl,
	initialOpenInNewTab,
	onSetLink,
}: LinkEditorPanelProps) => {
	const [url, setUrl] = useState(initialUrl || '');
	const [openInNewTab, setOpenInNewTab] = useState(
		initialOpenInNewTab || false
	);

	const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(event.target.value);
	}, []);

	const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (isValidUrl) {
				onSetLink(url, openInNewTab);
			}
		},
		[url, isValidUrl, openInNewTab, onSetLink]
	);

	return {
		url,
		setUrl,
		openInNewTab,
		setOpenInNewTab,
		onChange,
		handleSubmit,
		isValidUrl,
	};
};

export const LinkEditorPanel = ({
	onSetLink,
	initialOpenInNewTab,
	initialUrl,
}: LinkEditorPanelProps) => {
	const state = useLinkEditorState({
		onSetLink,
		initialOpenInNewTab,
		initialUrl,
	});

	return (
		<Surface className={styles.container}>
			<form onSubmit={state.handleSubmit} className={styles.form}>
				<label className={styles.inputWrapper}>
					<Icon name="Link" className={styles.icon} />
					<input
						type="url"
						className={styles.input}
						placeholder="Enter URL"
						value={state.url}
						onChange={state.onChange}
					/>
				</label>
				<Button
					variant="primary"
					buttonSize="small"
					type="submit"
					disabled={!state.isValidUrl}
				>
					Set Link
				</Button>
			</form>
			<div className={styles.toggleWrapper}>
				<label className={styles.toggleLabel}>
					Open in new tab
					<Toggle
						active={state.openInNewTab}
						onChange={state.setOpenInNewTab}
					/>
				</label>
			</div>
		</Surface>
	);
};

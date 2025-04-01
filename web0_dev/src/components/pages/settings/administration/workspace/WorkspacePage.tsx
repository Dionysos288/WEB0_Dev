'use client';
import Spacing from '@/components/general/Spacing';
import styles from './WorkspacePage.module.scss';
import Block from '@/components/general/ui/block/Block';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Organization } from '@prisma/client';
import { authClient } from '@/lib/auth-clients';

const WorkspacePage = ({ orgId }: { orgId: string }) => {
	console.log(orgId + 'sfsdf');
	const ref = useRef<HTMLInputElement>(null);
	const [organization, setOrganization] = useState<Organization | null>(null);
	const [name, setName] = useState('');
	const [url, setUrl] = useState('');
	const [image, setImage] = useState('');

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageClick = () => {
		ref.current?.click();
	};
	useEffect(() => {
		const getOrganization = async () => {
			const org = await authClient.organization.getFullOrganization({
				organizationId: orgId,
			});
			console.log(orgId);
			setOrganization(org);
			setName(org.name);
			setUrl(org.slug);
			setImage(org.logo);
		};
		getOrganization();
	}, [orgId]);

	return (
		<div className={styles.workspacePage}>
			<Block width="950px">
				<h2>Workspace</h2>

				<Spacing space={28} />
				<h3 className={styles.subHeader}>Workspace Settings</h3>
				<Spacing space={2} />
				<div className={styles.workspacePageContent}>
					<div className={styles.workspaceItem}>
						<div className={styles.leftSide}>
							<h3>Logo</h3>
							<p>Reccomended size: 256x256px</p>
						</div>
						<div className={styles.rightSide}>
							<div className={styles.profileImage} onClick={handleImageClick}>
								<Image
									src={image || '/default-logo.png'}
									alt={'Profile Image'}
									width={60}
									height={60}
								/>
								<Pencil className={styles.pencilIcon} width={24} height={24} />
								<input
									type="file"
									id="profileImage"
									onChange={handleImageChange}
									ref={ref}
								/>
							</div>
						</div>
					</div>
					<div className={styles.workspaceItem}>
						<div className={styles.leftSide}>
							<h3>Name</h3>
						</div>
						<div className={styles.rightSide}>
							<input
								className={styles.nameInput}
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder={name}
							/>
						</div>
					</div>
					<div className={styles.workspaceItem}>
						<div className={styles.leftSide}>
							<h3>URL</h3>
						</div>
						<div className={styles.rightSide}>
							<div className={styles.urlInputWrapper}>
								<span className={styles.urlPrefix}>web0.com/</span>
								<input
									className={styles.urlInput}
									type="text"
									value={url || ''}
									onChange={(e) => setUrl(e.target.value)}
									placeholder={url || 'your-workspace'}
								/>
							</div>
						</div>
					</div>
				</div>
			</Block>
			<Spacing space={28} />
		</div>
	);
};

export default WorkspacePage;

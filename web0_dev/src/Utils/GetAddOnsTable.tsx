import { Jpg } from '@/svgs';
import styles from './GetAddOnsTable.module.scss';
import Image from 'next/image';
const getFileType = (file: string | number) => {
	if (typeof file === 'number') {
		file = String(file);
	}
	const fileExtension = file.substring(file.lastIndexOf('.') + 1);
	switch (fileExtension) {
		case 'pdf':
		case 'doc':
		default:
			return (
				<div
					key={`${file}-${fileExtension}`}
					className={styles.block}
					style={{ backgroundColor: '#e8b594', marginRight: '4px' }}
				>
					<Jpg
						style={{
							fill: '#484643',
							transform: 'translateX(1px)',
						}}
					/>
				</div>
			);
	}
};
const getTypePerson = (type: string | number) => {
	if (typeof type === 'number') {
		type = String(type);
	}
	switch (type) {
		case 'Leads':
			return (
				<>
					<div
						style={{
							backgroundColor: 'var(--leads-90)',
							transform: 'translateY(0.5px)',
							marginRight: '2px',
						}}
						className={styles.ball}
					/>
					<span style={{ color: 'var(--leads)' }}>{type}</span>
				</>
			);
		case 'Contacted':
			return (
				<>
					<div
						style={{
							backgroundColor: 'var(--contacted-90)',
							transform: 'translateY(0.5px)',
							marginRight: '2px',
						}}
						className={styles.ball}
					/>
					<span style={{ color: 'var(--contacted)' }}>{type}</span>
				</>
			);
		case 'Opportunity':
			return (
				<>
					<div
						style={{
							backgroundColor: 'var(--oppurtunity-90)',
							transform: 'translateY(0.5px)',
							marginRight: '2px',
						}}
						className={styles.ball}
					/>
					<span style={{ color: 'var(--oppurtunity)' }}>{type}</span>
				</>
			);
		case 'Client':
			return (
				<>
					<div
						style={{
							backgroundColor: 'var(--client-90)',
							transform: 'translateY(0.5px)',
							marginRight: '2px',
						}}
						className={styles.ball}
					/>
					<span style={{ color: 'var(--client)' }}>{type}</span>
				</>
			);
		default:
			return <span>{type}</span>;
	}
};

const getImagePerson = (name: string | number) => {
	if (typeof name === 'number') {
		name = String(name);
	}
	return (
		<div style={{ marginRight: '4px', transform: 'translateY(0.5px)' }}>
			<Image
				src="https://placehold.co/24"
				alt="UserProfilePic"
				width={24}
				height={24}
				style={{ borderRadius: '360px', objectFit: 'cover' }}
			/>
		</div>
	);
};
export { getFileType, getTypePerson, getImagePerson };

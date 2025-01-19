'use client';
import React, { useState } from 'react';
import styles from './TableData.module.scss';
import { Dots, Jpg } from '@/svgs';
import { clientType, fileType, TableHeader } from '@/components/types/types';
import Image from 'next/image';
type CSSPropertiesWithVars = React.CSSProperties & {
	'--amount'?: string | number;
};

const TableData = ({
	type,
	tableData,
	tableHeaders,
}: {
	type: string;
	tableData: fileType[] | clientType[];
	tableHeaders: TableHeader[];
}) => {
	const [onHover, setOnHover] = useState<number | null>(null);
	const [active, setActive] = useState<number[]>([]);

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

	const addToList = (id: number) => {
		if (active.includes(id)) {
			setActive(active.filter((item) => item !== id));
		} else {
			setActive([...active, id]);
		}
	};

	return (
		<div
			className={`${styles.table} ${
				type === 'files' ? styles.files : styles.default
			}`}
			style={
				{
					'--amount': tableHeaders.length,
				} as CSSPropertiesWithVars
			}
		>
			{tableHeaders.map((header, index) => (
				<React.Fragment key={header[0] || index}>
					{index === 0 && (
						<div className={` ${styles.border}`}>
							<div className={`${styles.square}`} />
						</div>
					)}

					<div
						className={`${styles.tableHeader} ${
							index === tableHeaders.length - 1 ? styles.lastHeader : ''
						}`}
					>
						<h2>{header[1]}</h2>
					</div>
					{index === tableHeaders.length - 1 && (
						<div className={styles.space} />
					)}
				</React.Fragment>
			))}
			{tableData.map((data) => (
				<div
					key={data.id}
					className={`${styles.row} ${
						active.includes(data.id) ? styles.active : ''
					}`}
					onMouseOver={() => setOnHover(data.id)}
					onMouseOut={() => setOnHover(null)}
					onClick={() => addToList(data.id)}
				>
					{tableHeaders.map((header, index) => (
						<React.Fragment key={`${data.id}-${header[0]}`}>
							{index === 0 && (
								<div className={` ${styles.borderS}`}>
									<div
										className={`${styles.square} `}
										style={
											onHover === data.id
												? { opacity: '1' }
												: active.includes(data.id)
												? { opacity: '1' }
												: { opacity: '0' }
										}
									/>
								</div>
							)}
							<div
								className={styles.tableCell}
								style={index === 0 ? { padding: '8px 16px 8px 4px' } : {}}
							>
								{header[2] && typeof header[2] === 'object' && (
									<div className={styles.svg}>{header[2]}</div>
								)}
								{header[2] && header[2] === 'file' && (
									<>{getFileType(data[header[0]])}</>
								)}
								{header[2] && header[2] === 'user' && (
									<>{getImagePerson(data[header[0]])}</>
								)}
								{header[2] && header[2] === 'status' ? (
									<>{getTypePerson(data[header[0]])}</>
								) : (
									<span>{data[header[0]]}</span>
								)}
							</div>
							{index === tableHeaders.length - 1 && (
								<div className={styles.dots}>
									<Dots
										fill={'var(--main)'}
										style={
											onHover === data.id
												? { opacity: '1' }
												: active.includes(data.id)
												? { opacity: '1' }
												: { opacity: '0' }
										}
									/>
								</div>
							)}
						</React.Fragment>
					))}
				</div>
			))}
		</div>
	);
};

export default TableData;

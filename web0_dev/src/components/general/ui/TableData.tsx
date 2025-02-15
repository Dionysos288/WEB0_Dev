'use client';
import React, { useState } from 'react';
import styles from './TableData.module.scss';
import { DataType, fileType, TableHeader } from '@/components/types/types';
import {
	getFileType,
	getImagePerson,
	getTypePerson,
} from '@/utils/GetAddOnsTable';
import { Client } from '@prisma/client';
import GetFileSize from '@/utils/GetFileSize';
import Dots from '@/svgs/Dots';
import { getTimeAgo } from '@/utils/DateHooks';
type CSSPropertiesWithVars = React.CSSProperties & {
	'--amount'?: string | number;
};

const TableData = ({
	type,
	tableData,
	tableHeaders,
}: {
	type: string;
	tableData: fileType[] | Client[];
	tableHeaders: TableHeader[];
}) => {
	console.log('tableData', tableData);
	const [onHover, setOnHover] = useState<string | null>(null);
	const [active, setActive] = useState<string[]>([]);

	const addToList = (id: string) => {
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
					{tableHeaders.map((header, index) => {
						const value = data[header[0] as keyof DataType];
						const displayValue =
							value instanceof Date
								? getTimeAgo(String(value))
								: header[2] && header[2] === 'size'
								? GetFileSize(Number(data[header[0] as keyof DataType]))
								: value;

						return (
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
										<>
											{getFileType(String(data[header[0] as keyof DataType]))}
										</>
									)}

									{header[2] && header[2] === 'user' && (
										<>
											{getImagePerson(
												String(data[header[0] as keyof DataType])
											)}
										</>
									)}
									{header[2] && header[2] === 'status' ? (
										<>
											{getTypePerson(String(data[header[0] as keyof DataType]))}
										</>
									) : (
										<span>{displayValue}</span>
									)}
								</div>
								{index === tableHeaders.length - 1 && (
									<div className={styles.dots}>
										<Dots
											fill={'var(--main)'}
											width="20"
											height="20"
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
						);
					})}
				</div>
			))}
		</div>
	);
};

export default TableData;

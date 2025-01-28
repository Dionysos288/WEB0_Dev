'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, PieProps } from 'recharts';
import CustomTooltip from './CustomtoolTip';

const DoughnutChart = ({
	data,
	width = 200,
	height = 200,
}: {
	data: { name: string; value: number; color: string }[];
	width?: number;
	height?: number;
}) => {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onPieEnter: PieProps['onMouseEnter'] = (_, index) => {
		if (typeof index === 'number') {
			setActiveIndex(index);
		}
	};

	const onMouseDown = (event: React.MouseEvent) => {
		event.preventDefault();
	};

	if (!isMounted) {
		return null;
	}

	return (
		<PieChart width={width} height={height}>
			<Pie
				activeIndex={activeIndex}
				data={data}
				dataKey="value"
				cx={width / 2}
				cy={height / 2}
				innerRadius={width / 4}
				outerRadius={width / 2.5}
				paddingAngle={1}
				fill="none"
				isAnimationActive={true}
				onMouseEnter={onPieEnter}
				cornerRadius={4}
				stroke="none"
			>
				{data.map((entry) => (
					<Cell
						key={`slice-${entry.name}`}
						fill={entry.color}
						onMouseDown={onMouseDown}
						stroke="none"
					/>
				))}
			</Pie>
			<Tooltip content={<CustomTooltip />} />
		</PieChart>
	);
};

export default DoughnutChart;

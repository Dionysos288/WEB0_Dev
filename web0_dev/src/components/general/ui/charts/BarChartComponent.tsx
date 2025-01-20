'use client';
import React from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import CustomTooltip from './CustomtoolTip';

const BarChartComponent = ({
	data,
	height = 200,
}: {
	data: { name: string; value: number; color: string }[];
	height?: number;
}) => {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<BarChart data={data}>
				<CartesianGrid vertical={false} stroke="var(--main-10)" />
				<XAxis
					dataKey="name"
					padding={{ left: 20, right: 20 }}
					tick={{ fontSize: 13, fill: 'var(--main-50)' }}
					stroke="var(--main-30)"
					tickMargin={12}
					tickLine={false}
					strokeWidth={2}
				/>
				<YAxis
					tick={{ fontSize: 13, fill: 'var(--main-50)' }}
					stroke="transparant"
				/>
				<Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
				<Bar dataKey="value" isAnimationActive={true} radius={[12, 12, 0, 0]}>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default BarChartComponent;

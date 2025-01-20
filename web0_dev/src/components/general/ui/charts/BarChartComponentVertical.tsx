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

const BarChartComponentHorizontal = ({
	data,
	height = 200,
	money = false,
}: {
	data: { name: string; value: number; color: string }[];
	height?: number;
	money?: boolean;
}) => {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<BarChart data={data} layout="vertical">
				<defs>
					{data.map((entry, index) => {
						const gradId = `grad-${index}`;
						return (
							<linearGradient
								key={gradId}
								id={gradId}
								x1="0"
								y1="0"
								x2="1"
								y2="0"
							>
								<stop offset="0%" stopColor={entry.color} stopOpacity={0.7} />
								<stop offset="100%" stopColor={entry.color} stopOpacity={1} />
							</linearGradient>
						);
					})}
				</defs>
				<CartesianGrid horizontal={false} stroke="var(--main-10)" />
				<XAxis
					type="number"
					tick={{ fontSize: 13, fill: 'var(--main-50)' }}
					stroke="transparant"
					tickMargin={12}
					strokeWidth={2}
				/>
				<YAxis
					type="category"
					dataKey="name"
					tickMargin={12}
					tickLine={false}
					tick={{ fontSize: 13, fill: 'var(--main-50)' }}
					stroke="var(--main-30)"
					strokeWidth={2}
					width={80}
				/>
				<Tooltip
					content={<CustomTooltip money={money} />}
					cursor={{ fill: 'transparent' }}
				/>
				<Bar dataKey="value" isAnimationActive={true} radius={[0, 12, 12, 0]}>
					{data.map((entry, index) => {
						const gradId = `grad-${index}`;
						return <Cell key={index} fill={`url(#${gradId})`} />;
					})}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default BarChartComponentHorizontal;

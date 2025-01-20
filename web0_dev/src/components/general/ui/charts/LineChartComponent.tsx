'use client';
import React from 'react';
import {
	ComposedChart,
	Line,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import CustomTooltip from './CustomtoolTip';

interface DataItem {
	name: string;
	value: number;
}

export default function LineChartWithShadow({
	data,
	height = 200,
	money = false,
}: {
	data: DataItem[];
	height?: number;
	money?: boolean;
}) {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<ComposedChart data={data}>
				<CartesianGrid stroke="var(--main-10)" vertical={false} />

				<XAxis
					dataKey="name"
					tick={{ fontSize: 13, fill: 'var(--main-50)' }}
					stroke="var(--main-30)"
					tickMargin={12}
					tickLine={false}
					strokeWidth={1}
				/>

				<YAxis
					tickMargin={12}
					tick={{ fontSize: 13, fill: 'var(--main-50)' }}
					stroke="transparent"
				/>

				<Tooltip
					cursor={{ stroke: 'transparent', strokeWidth: 1 }}
					content={<CustomTooltip money={money} />}
				/>

				<defs>
					<linearGradient id="colorShadow" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="var(--orange)" stopOpacity={0.35} />
						<stop offset="100%" stopColor="var(--orange)" stopOpacity={0} />
					</linearGradient>
				</defs>

				<Area
					type="monotone"
					dataKey="value"
					stroke="none"
					fill="url(#colorShadow)"
				/>

				<Line
					type="monotone"
					dataKey="value"
					stroke="var(--orange)"
					strokeWidth={4}
					dot={false}
					activeDot={{
						r: 7,
						fill: 'var(--orange)',
						stroke: 'white',
						strokeWidth: 4,
					}}
					isAnimationActive
				/>
			</ComposedChart>
		</ResponsiveContainer>
	);
}

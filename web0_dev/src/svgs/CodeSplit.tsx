import * as React from 'react';

interface SVGProps {
	width?: string;
	height?: string;
	fill?: string;
	style?: React.CSSProperties;
}

const CodeSplit: React.FC<SVGProps> = ({
	width = '24',
	height = '24',
	fill = 'currentColor',
	style,
}) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={style}
		>
			<rect
				x="2"
				y="2"
				width="20"
				height="9"
				rx="2"
				stroke={fill}
				strokeWidth="1.5"
			/>
			<rect
				x="2"
				y="13"
				width="20"
				height="9"
				rx="2"
				stroke={fill}
				strokeWidth="1.5"
			/>
			<path
				d="M5 5.5H12"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M5 8.5H10"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M14 5.5H18"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M5 16.5H12"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M5 19.5H10"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M14 16.5H19"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
};

export default CodeSplit;

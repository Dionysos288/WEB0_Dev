import * as React from 'react';

interface SVGProps {
	width?: string;
	height?: string;
	fill?: string;
	style?: React.CSSProperties;
}

const CodeFull: React.FC<SVGProps> = ({
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
				height="20"
				rx="2"
				stroke={fill}
				strokeWidth="1.5"
			/>
			<path d="M6 6H18" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
			<path
				d="M6 10H15"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M6 14H13"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M6 18H16"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
};

export default CodeFull;

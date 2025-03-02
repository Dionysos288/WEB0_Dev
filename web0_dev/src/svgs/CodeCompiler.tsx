import * as React from 'react';

interface SVGProps {
	width?: string;
	height?: string;
	fill?: string;
	style?: React.CSSProperties;
}

const CodeCompiler: React.FC<SVGProps> = ({
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
				height="15"
				rx="2"
				stroke={fill}
				strokeWidth="1.5"
			/>
			<rect
				x="2"
				y="17"
				width="20"
				height="5"
				rx="2"
				stroke={fill}
				strokeWidth="1.5"
			/>
			<path d="M6 6H14" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
			<path
				d="M6 10H18"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M6 14H12"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M6 20H16"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeDasharray="1 2"
			/>
			<circle cx="19" cy="8" r="1.5" fill={fill} />
		</svg>
	);
};

export default CodeCompiler;

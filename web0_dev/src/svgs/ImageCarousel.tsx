import * as React from 'react';

interface SVGProps {
	width?: string;
	height?: string;
	fill?: string;
	style?: React.CSSProperties;
}

const ImageCarousel: React.FC<SVGProps> = ({
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
				x="3"
				y="5"
				width="18"
				height="14"
				rx="2"
				stroke={fill}
				strokeWidth="1.5"
			/>
			<rect
				x="9"
				y="4"
				width="6"
				height="16"
				rx="1"
				fill={fill}
				fillOpacity="0.2"
			/>
			<path d="M2 12H4" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
			<path
				d="M20 12H22"
				stroke={fill}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<circle cx="12" cy="19" r="1" fill={fill} />
			<circle cx="9" cy="19" r="0.5" fill={fill} />
			<circle cx="15" cy="19" r="0.5" fill={fill} />
			<circle cx="7" cy="10" r="1" fill={fill} />
		</svg>
	);
};

export default ImageCarousel;

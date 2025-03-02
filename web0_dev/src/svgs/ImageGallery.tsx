import * as React from 'react';

interface SVGProps {
	width?: string;
	height?: string;
	fill?: string;
	style?: React.CSSProperties;
}

const ImageGallery: React.FC<SVGProps> = ({
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
				width="8"
				height="8"
				rx="1"
				stroke={fill}
				strokeWidth="1.5"
			/>
			<rect
				x="14"
				y="2"
				width="8"
				height="8"
				rx="1"
				stroke={fill}
				strokeWidth="1.5"
			/>
			<rect
				x="2"
				y="14"
				width="8"
				height="8"
				rx="1"
				stroke={fill}
				strokeWidth="1.5"
			/>
			<rect
				x="14"
				y="14"
				width="8"
				height="8"
				rx="1"
				stroke={fill}
				strokeWidth="1.5"
			/>
			<circle cx="5" cy="5" r="1" fill={fill} />
			<circle cx="17" cy="5" r="1" fill={fill} />
			<circle cx="5" cy="17" r="1" fill={fill} />
			<circle cx="17" cy="17" r="1" fill={fill} />
		</svg>
	);
};

export default ImageGallery;

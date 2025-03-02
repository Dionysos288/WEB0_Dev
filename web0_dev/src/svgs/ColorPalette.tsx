import * as React from 'react';

interface SVGProps {
	width?: string;
	height?: string;
	fill?: string;
	style?: React.CSSProperties;
}

const ColorPalette: React.FC<SVGProps> = ({
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
			<circle cx="12" cy="12" r="9" stroke={fill} strokeWidth="1.5" />
			<circle cx="12" cy="6" r="2" fill="#FF5E5E" />
			<circle cx="18" cy="12" r="2" fill="#5E8AFF" />
			<circle cx="12" cy="18" r="2" fill="#53D75A" />
			<circle cx="6" cy="12" r="2" fill="#FFD15E" />
		</svg>
	);
};

export default ColorPalette;

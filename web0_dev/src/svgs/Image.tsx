import React from 'react';

interface ImageProps {
	width?: string;
	height?: string;
	fill?: string;
	style?: React.CSSProperties;
}

const ImageIcon: React.FC<ImageProps> = ({
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
			<path
				d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z"
				fill={fill}
			/>
		</svg>
	);
};

export default ImageIcon;

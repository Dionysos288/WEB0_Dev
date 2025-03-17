import React from 'react';

interface DownloadProps {
	width?: string;
	height?: string;
	fill?: string;
	style?: React.CSSProperties;
	onClick?: (e: React.MouseEvent) => void;
}

const Download: React.FC<DownloadProps> = ({
	width = '24',
	height = '24',
	fill = 'currentColor',
	style,
	onClick,
}) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={style}
			onClick={onClick}
		>
			<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill={fill} />
		</svg>
	);
};

export default Download;

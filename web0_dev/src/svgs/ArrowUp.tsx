import React from 'react';

interface ArrowUpProps {
	width?: string;
	height?: string;
	fill?: string;
	style?: React.CSSProperties;
	onClick?: (e: React.MouseEvent) => void;
}

const ArrowUp: React.FC<ArrowUpProps> = ({
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
			<path d="M12 4L4 12H9V20H15V12H20L12 4Z" fill={fill} />
		</svg>
	);
};

export default ArrowUp;

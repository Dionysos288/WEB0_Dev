import React from 'react';

interface TrashProps {
	width?: string;
	height?: string;
	fill?: string;
	style?: React.CSSProperties;
	onClick?: (e: React.MouseEvent) => void;
}

const Trash: React.FC<TrashProps> = ({
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
			<path
				d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
				fill={fill}
			/>
		</svg>
	);
};

export default Trash;

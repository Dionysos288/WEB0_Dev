import React from 'react';

function LowPriority(props: {
	fill?: string;
	width?: string;
	height?: string;
	style?: React.CSSProperties;
}) {
	const fill = props.fill || 'currentColor';
	const width = props.width || '1em';
	const height = props.height || '1em';

	return (
		<svg
			height={height}
			role="img"
			width={width}
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g fill={fill}>
				<rect height="6" width="3" rx="1" x="1.5" y="8" />
				<rect height="9" width="3" fillOpacity=".4" rx="1" x="6.5" y="5" />
				<rect height="12" width="3" fillOpacity=".4" rx="1" x="11.5" y="2" />
			</g>
		</svg>
	);
}

export default LowPriority;

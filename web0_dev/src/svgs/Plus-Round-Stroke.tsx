import React from 'react';

function PlusRoundStroke(props: {
	fill?: string,
	width?: string,
	height?: string,
}) {
	const fill = props.fill || 'currentColor';
	const width = props.width || '1em';
	const height = props.height || '1em';

	return (
		<svg
			height={height}
			width={width}
			viewBox="0 0 19 18"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g fill="none">
				<rect
					height="16.8"
					width="16.8"
					rx="8.4"
					stroke={fill}
					strokeOpacity=".9"
					strokeWidth="1.2"
					x="1.395"
					y=".6"
				/>
				<path
					d="M5.79492 9H13.7949"
					stroke={fill}
					strokeLinecap="round"
					strokeOpacity=".9"
					strokeWidth="1.2"
				/>
				<path
					d="M9.79492 13V5"
					stroke={fill}
					strokeLinecap="round"
					strokeOpacity=".9"
					strokeWidth="1.2"
				/>
			</g>
		</svg>
	);
}

export default PlusRoundStroke;

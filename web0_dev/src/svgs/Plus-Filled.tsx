import React from 'react';

function PlusFilled(props: { fill?: string, width?: string, height?: string }) {
	const fill = props.fill || 'currentColor';
	const width = props.width || '1em';
	const height = props.height || '1em';

	return (
		<svg
			height={height}
			width={width}
			viewBox="0 0 14 14"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g fill="none">
				<path
					d="M2.91699 7H11.0837"
					stroke={fill}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
				/>
				<path
					d="M7 11.0833V2.91663"
					stroke={fill}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
				/>
			</g>
		</svg>
	);
}

export default PlusFilled;

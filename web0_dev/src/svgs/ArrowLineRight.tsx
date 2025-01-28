import React from 'react';

function ArrowLineRight(props: {
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
			width={width}
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g fill="none">
				<path
					d="M5.65967 12.3536C5.44678 12.1583 5.44678 11.8417 5.65967 11.6464L9.25 8.35355C9.4629 8.15829 9.4629 7.84171 9.25 7.64645L5.65968 4.35355C5.44678 4.15829 5.44678 3.84171 5.65968 3.64645C5.87257 3.45118 6.21775 3.45118 6.43065 3.64645L10.021 6.93934C10.6597 7.52513 10.6597 8.47487 10.021 9.06066L6.43065 12.3536C6.21775 12.5488 5.87257 12.5488 5.65967 12.3536Z"
					fill={fill}
					fillOpacity="1.000"
					fillRule="evenodd"
				/>
			</g>
		</svg>
	);
}

export default ArrowLineRight;

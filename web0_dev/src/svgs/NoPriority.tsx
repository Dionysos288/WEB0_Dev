import React from 'react';

function NoPriority(props: {
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
				<rect height="1.5" width="3" opacity=".9" rx=".5" x="1.5" y="7.25" />
				<rect height="1.5" width="3" opacity=".9" rx=".5" x="6.5" y="7.25" />
				<rect height="1.5" width="3" opacity=".9" rx=".5" x="11.5" y="7.25" />
			</g>
		</svg>
	);
}

export default NoPriority;

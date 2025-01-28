import React from 'react';

function ArrowLineLeftFilled(props: {
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
				<path d="M10.7803 4.78033C11.0732 4.48744 11.0732 4.01256 10.7803 3.71967C10.4874 3.42678 10.0126 3.42678 9.71967 3.71967L5.71967 7.71967C5.42933 8.01001 5.42643 8.47986 5.71318 8.77376L9.61581 12.7738C9.90508 13.0702 10.3799 13.0761 10.6764 12.7868C10.9729 12.4976 10.9787 12.0227 10.6895 11.7262L7.30417 8.25649L10.7803 4.78033Z" />
			</g>
		</svg>
	);
}

export default ArrowLineLeftFilled;

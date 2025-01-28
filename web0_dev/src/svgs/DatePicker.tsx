import React from 'react';

function DatePicker(props: { fill?: string; width?: string; height?: string }) {
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
		>
			<g fill={fill}>
				<path d="M11 1C13.2091 1 15 2.79086 15 5V11C15 13.2091 13.2091 15 11 15H5C2.79086 15 1 13.2091 1 11V5C1 2.79086 2.79086 1 5 1H11ZM13.5 6H2.5V11C2.5 12.3807 3.61929 13.5 5 13.5H11C12.3807 13.5 13.5 12.3807 13.5 11V6Z" />
			</g>
		</svg>
	);
}

export default DatePicker;

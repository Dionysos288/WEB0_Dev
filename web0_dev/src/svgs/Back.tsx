import React from 'react';

function Back(props: {
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
				<path d="M7.201 3.511c.27.25.287.67.038.94l-1.97 2.134h4.48v.665-.665h.049l.102.006a3.989 3.989 0 0 1 1.373.334c.385.173.8.447 1.12.878.326.44.522 1.003.522 1.697l-.001 2.75a.665.665 0 1 1-1.33 0l.001-2.75c0-.43-.117-.711-.26-.905a1.487 1.487 0 0 0-.598-.457 2.66 2.66 0 0 0-.969-.223H5.355L7.22 9.78a.665.665 0 0 1-.94.94L3.62 8.06a1.165 1.165 0 0 1-.033-1.614l2.674-2.897c.25-.27.67-.287.94-.038Z" />
			</g>
		</svg>
	);
}

export default Back;

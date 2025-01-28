import React from 'react';

type iconProps = {
	fill?: string;
	secondaryfill?: string;
	strokewidth?: number;
	width?: string;
	height?: string;
	title?: string;
};

function Phase(props: iconProps) {
	const fill = props.fill || 'currentColor';
	const width = props.width || '1em';
	const height = props.height || '1em';
	const title = props.title || 'Phase';

	return (
		<svg height={height} width={width} viewBox="0 0 16 16">
			<title>{title}</title>
			<g fill="none">
				<path
					d="M7.3406 2.32C7.68741 1.89333 8.31259 1.89333 8.6594 2.32L12.7903 7.402C13.0699 7.74597 13.0699 8.25403 12.7903 8.598L8.6594 13.68C8.31259 14.1067 7.68741 14.1067 7.3406 13.68L3.2097 8.598C2.9301 8.25403 2.9301 7.74597 3.2097 7.402L7.3406 2.32Z"
					fill="none"
					opacity="1.000"
					stroke={fill}
					strokeLinejoin="round"
					strokeWidth="2"
				/>
			</g>
		</svg>
	);
}

export default Phase;

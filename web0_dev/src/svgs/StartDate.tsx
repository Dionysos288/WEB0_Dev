import React from 'react';

function StartDate(props: { fill?: string; width?: string; height?: string }) {
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
				<path d="M11 1C13.2091 1 15 2.79086 15 5V6.25C15 6.66421 14.6642 7 14.25 7C13.8358 7 13.5 6.66421 13.5 6.25V6H2.5V11C2.5 12.3807 3.61929 13.5 5 13.5H6.25C6.66421 13.5 7 13.8358 7 14.25C7 14.6642 6.66421 15 6.25 15H5C2.79086 15 1 13.2091 1 11V5C1 2.79086 2.79086 1 5 1H11Z" />
				<path
					d="M10.9118 8.16689C11.0947 7.96599 11.4153 7.94327 11.6279 8.11614L14.8823 10.7625C14.8952 10.7731 14.9073 10.7846 14.9185 10.7968C15.0402 10.931 15.0237 11.133 14.8818 11.2479L11.6272 13.8845C11.5351 13.959 11.4179 14 11.2967 14C11.0162 14 10.7889 13.7851 10.7889 13.5201L10.7903 12.1013C8.78103 11.922 6 11.3681 6 11.0389C6 10.79 6.26274 10.4027 10.7882 9.87701L10.7889 8.4799C10.7889 8.36503 10.8325 8.25396 10.9118 8.16689Z"
					fillRule="evenodd"
				/>
			</g>
		</svg>
	);
}

export default StartDate;

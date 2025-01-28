import React from 'react';

function ArrowLeft(props: { fill?: string; width?: string; height?: string }) {
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
					d="M6.26075 11.5444C6.43571 11.7111 6.71264 11.7044 6.87929 11.5294C7.04594 11.3544 7.0392 11.0775 6.86425 10.9109L3.21759 7.43734L11.8125 7.43734C12.0541 7.43734 12.25 7.24146 12.25 6.99984C12.25 6.75822 12.0541 6.56234 11.8125 6.56234L3.21753 6.56234L6.86425 3.08876C7.0392 2.92211 7.04594 2.64518 6.87929 2.47023C6.71264 2.29527 6.43571 2.28853 6.26075 2.45519L1.93304 6.57743C1.8345 6.67129 1.7762 6.79102 1.75813 6.91548C1.75279 6.94278 1.75 6.97098 1.75 6.99984C1.75 7.02875 1.7528 7.05701 1.75816 7.08436C1.77626 7.20875 1.83456 7.32839 1.93304 7.4222L6.26075 11.5444Z"
					fill={fill}
				/>
			</g>
		</svg>
	);
}

export default ArrowLeft;

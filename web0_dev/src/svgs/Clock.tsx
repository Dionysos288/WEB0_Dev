import React from 'react';

function Clock(props: { fill?: string, width?: string, height?: string }) {
	const fill = props.fill || 'currentColor';
	const width = props.width || '1em';
	const height = props.height || '1em';

	return (
		<svg
			height={height}
			width={width}
			viewBox="0 0 12 12"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g fill="none">
				<path
					d="M1.75 6C1.75 3.65279 3.65279 1.75 6 1.75C8.34721 1.75 10.25 3.65279 10.25 6C10.25 8.34721 8.34721 10.25 6 10.25C3.65279 10.25 1.75 8.34721 1.75 6ZM6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1ZM5.99657 3.32414C5.97173 3.14117 5.81475 3 5.625 3C5.418 3 5.25 3.168 5.25 3.375V6.375L5.25343 6.42586C5.27827 6.60883 5.43525 6.75 5.625 6.75H7.625L7.67586 6.74657C7.85883 6.72173 8 6.56475 8 6.375C8 6.168 7.832 6 7.625 6H6V3.375L5.99657 3.32414Z"
					fill={fill}
					fillOpacity="1.000"
				/>
			</g>
		</svg>
	);
}

export default Clock;

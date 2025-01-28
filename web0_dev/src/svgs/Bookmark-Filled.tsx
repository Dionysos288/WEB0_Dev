import React from 'react';

function BookmarkFilled(props: {
	fill?: string;
	width?: string;
	height?: string;
}) {
	const fill = props.fill || 'currentColor';
	const width = props.width || '1em';
	const height = props.height || '1em';

	return (
		<svg
			height={height}
			width={width}
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g fill="none">
				<path
					d="M5.15896 18.2115C4.74551 18.509 4.16895 18.2135 4.16895 17.7042V5.2076C4.16895 3.71183 5.38151 2.49927 6.87728 2.49927H13.1259C14.6217 2.49927 15.8343 3.71183 15.8343 5.2076V17.7042C15.8343 18.2135 15.2577 18.509 14.8443 18.2115L10.0016 14.7274L5.15896 18.2115Z"
					fill={fill}
					fillOpacity=".9"
				/>
			</g>
		</svg>
	);
}

export default BookmarkFilled;

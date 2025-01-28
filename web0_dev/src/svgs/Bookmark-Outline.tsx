import React from 'react';

function BookmarkOutline(props: {
	fill?: string,
	width?: string,
	height?: string,
}) {
	const fill = props.fill || 'currentColor';
	const width = props.width || '1em';
	const height = props.height || '1em';

	return (
		<svg
			height={height}
			width={width}
			viewBox="0 0 21 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g fill="none">
				<path
					d="M5.95388 18.2115C5.54043 18.509 4.96387 18.2135 4.96387 17.7042V5.2076C4.96387 3.71183 6.17643 2.49927 7.6722 2.49927H13.9209C15.4166 2.49927 16.6292 3.71183 16.6292 5.2076V17.7042C16.6292 18.2135 16.0526 18.509 15.6392 18.2115L10.7965 14.7274L5.95388 18.2115ZM15.3792 5.2076C15.3792 4.40219 14.7263 3.74927 13.9209 3.74927H7.6722C6.86679 3.74927 6.21387 4.40219 6.21387 5.2076V16.4846L10.4315 13.4501C10.6496 13.2933 10.9435 13.2933 11.1615 13.4501L15.3792 16.4846V5.2076Z"
					fill={fill}
					fillOpacity=".9"
				/>
			</g>
		</svg>
	);
}

export default BookmarkOutline;

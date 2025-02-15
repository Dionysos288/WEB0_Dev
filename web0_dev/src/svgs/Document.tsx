import React from 'react';

function Document(props: { fill?: string, width?: string, height?: string }) {
	const fill = props.fill || 'currentColor';
	const width = props.width || '1em';
	const height = props.height || '1em';

	return (
		<svg
			height={height}
			width={width}
			viewBox="0 0 22 22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g fill="none">
				<path
					d="M5.50033 1.8335C4.4878 1.8335 3.66699 2.65431 3.66699 3.66683V18.3335C3.66699 19.346 4.4878 20.1668 5.50033 20.1668H16.5003C17.5128 20.1668 18.3337 19.346 18.3337 18.3335V9.00895C18.3337 8.52272 18.1405 8.0564 17.7967 7.71259L12.4546 2.37047C12.1108 2.02665 11.6444 1.8335 11.1582 1.8335H5.50033ZM5.04199 3.66683C5.04199 3.4137 5.2472 3.2085 5.50033 3.2085H11.0003V7.3335C11.0003 8.34602 11.8211 9.16683 12.8337 9.16683H16.9587V18.3335C16.9587 18.5866 16.7535 18.7918 16.5003 18.7918H5.50033C5.2472 18.7918 5.04199 18.5866 5.04199 18.3335V3.66683ZM15.9314 7.79183H12.8337C12.5805 7.79183 12.3753 7.58663 12.3753 7.3335V4.23577L15.9314 7.79183Z"
					fill={fill}
					fillOpacity=".9"
				/>
			</g>
		</svg>
	);
}

export default Document;

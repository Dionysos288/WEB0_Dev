import React from 'react';

function DatePickerV2(props: {
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
			viewBox="0 0 17 16"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g fill="none">
				<path
					d="M10.833 2V1.5C10.833 1.22386 11.0569 1 11.333 1C11.6091 1 11.833 1.22386 11.833 1.5V2H13.333C13.333 2 13.7472 2 14.0401 2.29289C14.0401 2.29289 14.333 2.58579 14.333 3V13C14.333 13 14.333 13.4142 14.0401 13.7071C14.0401 13.7071 13.7472 14 13.333 14H3.33301C3.33301 14 2.91879 14 2.6259 13.7071C2.6259 13.7071 2.33301 13.4142 2.33301 13V3C2.33301 3 2.33301 2.58579 2.6259 2.29289C2.6259 2.29289 2.91879 2 3.33301 2H4.83301V1.5C4.83301 1.22386 5.05687 1 5.33301 1C5.60915 1 5.83301 1.22386 5.83301 1.5V2H10.833ZM3.33301 6V13H13.333V6H3.33301ZM13.333 5H3.33301V3H4.83301V3.5C4.83301 3.77614 5.05687 4 5.33301 4C5.60915 4 5.83301 3.77614 5.83301 3.5V3H10.833V3.5C10.833 3.77614 11.0569 4 11.333 4C11.6091 4 11.833 3.77614 11.833 3.5V3H13.333V5Z"
					fill={fill}
					fillOpacity="1.000"
					fillRule="evenodd"
				/>
			</g>
		</svg>
	);
}

export default DatePickerV2;

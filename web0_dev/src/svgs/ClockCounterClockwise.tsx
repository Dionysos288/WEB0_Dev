import React from 'react';

function ClockCounterClockwise(props: {
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
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g fill="none">
				<path
					d="M9.375 6.25V10C9.375 10.3452 9.65482 10.625 10 10.625C10.3452 10.625 10.625 10.3452 10.625 10V6.25C10.625 5.90482 10.3452 5.625 10 5.625C9.65482 5.625 9.375 5.90482 9.375 6.25Z"
					fill={fill}
				/>
				<path
					d="M10.3124 9.45868L13.5623 11.3336C13.7451 11.4391 13.8623 11.6295 13.874 11.8402C13.8747 11.8518 13.875 11.8634 13.875 11.875C13.875 11.9846 13.8462 12.0924 13.7914 12.1873C13.6859 12.3701 13.4955 12.4873 13.2848 12.499C13.2732 12.4997 13.2616 12.5 13.25 12.5C13.1404 12.5 13.0326 12.4712 12.9377 12.4164L9.68776 10.5414C9.54721 10.4603 9.44375 10.3279 9.39913 10.172L9.39635 10.162C9.38218 10.1091 9.375 10.0547 9.375 10C9.375 9.90011 9.39894 9.80167 9.44482 9.71294C9.44923 9.70441 9.45384 9.69599 9.45863 9.68767C9.53967 9.54721 9.67213 9.44375 9.82803 9.39913L9.83804 9.39635C9.89086 9.38218 9.94531 9.375 10 9.375C10.0999 9.375 10.1983 9.39894 10.2871 9.44482C10.2956 9.44923 10.304 9.45384 10.3124 9.45868Z"
					fill={fill}
				/>
				<path
					d="M3.10937 7.16406V4.66406C3.10937 4.31888 2.82955 4.03906 2.48437 4.03906C2.1392 4.03906 1.85938 4.31888 1.85938 4.66406V7.78906C1.85938 8.13424 2.1392 8.41406 2.48437 8.41406H5.60938C5.95455 8.41406 6.23438 8.13424 6.23438 7.78906C6.23438 7.44388 5.95455 7.16406 5.60938 7.16406H3.10937Z"
					fill={fill}
				/>
				<path
					d="M4.69933 4.69795L2.04308 7.34638C1.92548 7.46365 1.85938 7.6229 1.85938 7.78897C1.85938 7.79945 1.85964 7.80993 1.86017 7.82039C1.86794 7.97478 1.93264 8.1208 2.04178 8.23027C2.15905 8.34787 2.3183 8.41397 2.48438 8.41397C2.49485 8.41397 2.50533 8.41371 2.51579 8.41318C2.67018 8.40541 2.8162 8.34071 2.92567 8.23157L2.92602 8.23121L5.58192 5.58313C6.92306 4.24089 8.78278 3.87038 8.78278 3.87038C10.6425 3.49987 12.3946 4.22518 12.3946 4.22518C14.1466 4.95049 15.2003 6.52707 15.2003 6.52707C16.254 8.10365 16.254 9.99991 16.254 9.99991C16.254 11.8962 15.2003 13.4728 15.2003 13.4728C14.1466 15.0493 12.3946 15.7746 12.3946 15.7746C10.6425 16.5 8.78278 16.1294 8.78278 16.1294C6.92306 15.7589 5.58275 14.4175 5.58275 14.4175C5.46552 14.3002 5.30648 14.2343 5.14063 14.2343C5.12993 14.2343 5.11923 14.2346 5.10854 14.2351C4.95417 14.243 4.80821 14.3079 4.69886 14.4172C4.58161 14.5343 4.51569 14.6933 4.51562 14.859L4.51563 14.8593C4.51562 14.8692 4.51586 14.8791 4.51633 14.8891C4.52373 15.0443 4.58868 15.1911 4.6985 15.3011L4.69868 15.3012C6.30701 16.9108 8.53854 17.3554 8.53854 17.3554C10.7702 17.8 12.8727 16.9296 12.8727 16.9296C14.9752 16.0592 16.2396 14.1673 16.2396 14.1673C17.504 12.2754 17.504 9.99991 17.504 9.99991C17.504 7.7244 16.2396 5.8325 16.2396 5.8325C14.9752 3.9406 12.8727 3.07023 12.8727 3.07023C10.7702 2.19986 8.53854 2.64447 8.53854 2.64447C6.30688 3.08908 4.69933 4.69795 4.69933 4.69795Z"
					fill={fill}
				/>
			</g>
		</svg>
	);
}

export default ClockCounterClockwise;

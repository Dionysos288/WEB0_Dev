import React from 'react';

function DesignIdeas(props: {
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
					d="M4.64607 1.7282C4.86261 1.83227 5.00033 2.05126 5.00033 2.29151C5.00033 2.98304 5.26041 3.3812 5.58626 3.86607L5.60996 3.90129C5.88707 4.313 6.25033 4.85267 6.25033 5.62484C6.25033 6.41277 5.85268 7.10783 5.24712 7.52027C5.40644 7.65384 5.54759 7.81857 5.66887 8.01486C6.06533 8.65654 6.25033 9.63693 6.25033 11.0456C6.25033 12.4724 6.05868 14.1857 5.7465 15.5535C5.59128 16.2336 5.39901 16.8611 5.16926 17.3326C5.05531 17.5665 4.91656 17.7949 4.7438 17.9736C4.57294 18.1502 4.30895 18.3372 3.95866 18.3372C3.60837 18.3372 3.34437 18.1502 3.17352 17.9736C3.00076 17.7949 2.86201 17.5665 2.74805 17.3326C2.5183 16.8611 2.32604 16.2336 2.17082 15.5535C1.85863 14.1857 1.66699 12.4724 1.66699 11.0456C1.66699 9.63693 1.85198 8.65654 2.24845 8.01486C2.36972 7.81857 2.51088 7.65384 2.6702 7.52027C2.06464 7.10783 1.66699 6.41277 1.66699 5.62484C1.66699 5.31802 1.66728 4.79058 1.9865 4.10957C2.2989 3.44311 2.89254 2.67734 3.98489 1.80347C4.1725 1.65338 4.42953 1.62412 4.64607 1.7282ZM2.91699 5.6238V5.62484C2.91699 6.20014 3.38336 6.66651 3.95866 6.66651C4.53396 6.66651 5.00033 6.20014 5.00033 5.62484C5.00033 5.25898 4.84631 5.00603 4.54877 4.56329L4.53859 4.54814C4.34786 4.26439 4.1226 3.92927 3.96183 3.4978C3.5091 3.95816 3.25908 4.33984 3.11832 4.64011C2.91699 5.06962 2.91699 5.37526 2.91699 5.6238ZM3.31185 8.67188C3.1051 9.00651 2.91699 9.69279 2.91699 11.0456C2.91699 12.3802 3.09845 14.0002 3.38948 15.2754C3.53586 15.9167 3.70273 16.4382 3.87178 16.7852C3.9029 16.849 3.93204 16.9027 3.95866 16.9473C3.98527 16.9027 4.01442 16.849 4.04554 16.7852C4.21458 16.4382 4.38146 15.9167 4.52784 15.2754C4.81887 14.0002 5.00033 12.3802 5.00033 11.0456C5.00033 9.69279 4.81222 9.00651 4.60547 8.67188C4.51139 8.51961 4.41798 8.44753 4.33453 8.40704C4.24468 8.36343 4.12589 8.33724 3.95866 8.33724C3.79143 8.33724 3.67264 8.36343 3.58278 8.40704C3.49934 8.44753 3.40593 8.51961 3.31185 8.67188ZM8.33361 12.4307C7.88501 12.3554 7.45667 12.2205 7.05704 12.0342C7.07452 11.6956 7.08361 11.364 7.08361 11.0456C7.08361 10.8991 7.08173 10.7554 7.07781 10.6145C7.45374 10.8671 7.87791 11.0535 8.33361 11.1569V8.74984C8.33361 8.05948 8.89325 7.49984 9.58361 7.49984H12.9169C12.9169 5.42877 11.238 3.74984 9.16694 3.74984C8.30994 3.74984 7.52008 4.03732 6.88854 4.52111C6.72227 4.06075 6.48463 3.70813 6.31928 3.46278L6.28573 3.41294C7.10013 2.83775 8.09407 2.49984 9.16694 2.49984C11.9284 2.49984 14.1669 4.73841 14.1669 7.49984H17.0836C17.774 7.49984 18.3336 8.05948 18.3336 8.74984V16.2498C18.3336 16.9402 17.774 17.4998 17.0836 17.4998H9.58361C8.89325 17.4998 8.33361 16.9402 8.33361 16.2498V12.4307ZM9.58361 12.4827V16.2498H17.0836V8.74984H14.0094C13.4878 10.7765 11.7275 12.3059 9.58361 12.4827ZM12.7036 8.74984H9.58361V11.227C11.0328 11.0667 12.2332 10.0807 12.7036 8.74984Z"
					fill={fill}
				/>
			</g>
		</svg>
	);
}

export default DesignIdeas;

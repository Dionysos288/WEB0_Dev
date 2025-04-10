import React from 'react';

function Text(props: {
	fill?: string;
	width?: string;
	height?: string;
	style?: React.CSSProperties;
}) {
	const fill = props.fill || 'currentColor';
	const width = props.width || '1em';
	const height = props.height || '1em';

	return (
		<svg
			height={height}
			width={width}
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g fill={fill}>
				<path d="M3.3335 3.1665C3.3335 2.89036 3.55735 2.6665 3.8335 2.6665H12.1668C12.443 2.6665 12.6668 2.89036 12.6668 3.1665V4.49984C12.6668 4.77598 12.443 4.99984 12.1668 4.99984C11.8907 4.99984 11.6668 4.77598 11.6668 4.49984V3.6665H8.50016L8.50016 12.3332H9.50016C9.7763 12.3332 10.0002 12.557 10.0002 12.8332C10.0002 13.1093 9.7763 13.3332 9.50016 13.3332H6.50016C6.22402 13.3332 6.00016 13.1093 6.00016 12.8332C6.00016 12.557 6.22402 12.3332 6.50016 12.3332H7.50016L7.50016 3.6665H4.3335V4.49984C4.3335 4.77598 4.10964 4.99984 3.8335 4.99984C3.55735 4.99984 3.3335 4.77598 3.3335 4.49984V3.1665Z" />
			</g>
		</svg>
	);
}

export default Text;

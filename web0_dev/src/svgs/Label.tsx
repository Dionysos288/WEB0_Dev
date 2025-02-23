import React from 'react';

interface LabelIconProps {
	width?: string;
	height?: string;
	fill?: string;
	className?: string;
}

const LabelIcon: React.FC<LabelIconProps> = ({
	width = '24',
	height = '24',
	fill = 'currentColor',
	className,
}) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M3 6.2C3 4.98497 3.98497 4 5.2 4H12.4C13.0365 4 13.647 4.25286 14.0971 4.70294L19.2971 9.90294C20.2333 10.8392 20.2333 12.3608 19.2971 13.2971L13.2971 19.2971C12.3608 20.2333 10.8392 20.2333 9.90294 19.2971L4.70294 14.0971C4.25286 13.647 4 13.0365 4 12.4V6.2C4 4.98497 4.98497 4 6.2 4"
				stroke={fill}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
				stroke={fill}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default LabelIcon;

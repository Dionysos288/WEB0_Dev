import React from 'react';

function ChatText(props: { fill?: string, width?: string, height?: string }) {
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
					d="M2.35508 11.017L3.84496 9.76711L3.89365 9.75H10.125C10.125 9.75 10.4357 9.75 10.6553 9.53033C10.6553 9.53033 10.875 9.31066 10.875 9V3C10.875 3 10.875 2.68934 10.6553 2.46967C10.6553 2.46967 10.4357 2.25 10.125 2.25H1.875C1.875 2.25 1.56434 2.25 1.34467 2.46967C1.34467 2.46967 1.125 2.68934 1.125 3L1.12501 10.4467C1.12501 10.4467 1.12673 10.6638 1.24416 10.8464C1.24416 10.8464 1.36158 11.029 1.55839 11.1207C1.55839 11.1207 1.75521 11.2123 1.97054 11.1847C1.97054 11.1847 2.18587 11.157 2.35508 11.017ZM3.70538 9.0212C3.74532 9.00717 3.78735 9 3.82969 9H10.125V3H1.875L1.87498 10.4408L3.41524 9.14864C3.44982 9.11963 3.48936 9.0971 3.53194 9.08214L3.70538 9.0212Z"
					fill={fill}
					fillOpacity="1.000"
					fillRule="evenodd"
				/>
				<path
					d="M4.5 5.625H7.5C7.70711 5.625 7.875 5.45711 7.875 5.25C7.875 5.04289 7.70711 4.875 7.5 4.875H4.5C4.29289 4.875 4.125 5.04289 4.125 5.25C4.125 5.45711 4.29289 5.625 4.5 5.625Z"
					fill={fill}
					fillOpacity="1.000"
				/>
				<path
					d="M4.5 7.125H7.5C7.70711 7.125 7.875 6.95711 7.875 6.75C7.875 6.54289 7.70711 6.375 7.5 6.375H4.5C4.29289 6.375 4.125 6.54289 4.125 6.75C4.125 6.95711 4.29289 7.125 4.5 7.125Z"
					fill={fill}
					fillOpacity="1.000"
				/>
			</g>
		</svg>
	);
}

export default ChatText;

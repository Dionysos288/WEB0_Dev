'use client';
import React, { useEffect, useRef } from 'react';

const ClickOutsideWrapper = ({
	onClose,
	children,
	closeOnEsc = false,
}: {
	onClose: () => void;
	children: React.ReactNode;
	closeOnEsc?: boolean;
}) => {
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		const handleEscPress = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && closeOnEsc) {
				onClose();
				const activeElement = document.activeElement as HTMLElement;
				if (activeElement) {
					activeElement.blur();
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleEscPress);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscPress);
		};
	}, [onClose, closeOnEsc]);

	return <div ref={wrapperRef}>{children}</div>;
};

export default ClickOutsideWrapper;

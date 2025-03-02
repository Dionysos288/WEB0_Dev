import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to handle scrolling behavior in popups/modals
 *
 * @param isOpen - Boolean indicating if the popup is open
 * @returns An object containing:
 * - contentRef: Callback ref to attach to scrollable content
 * - handleWheel: Event handler for wheel events
 */
const usePopupScroll = (isOpen: boolean) => {
	// Reference to the scrollable content element
	const contentRef = useRef<HTMLElement | null>(null);

	// Set the content ref using a callback ref
	const setContentRef = useCallback((element: HTMLElement | null) => {
		contentRef.current = element;
	}, []);

	// Handle wheel events to prevent body scrolling when cursor is over popup content
	const handleWheel = useCallback((e: React.WheelEvent) => {
		const contentElement = contentRef.current;
		if (!contentElement) return;

		const { scrollTop, scrollHeight, clientHeight } = contentElement;
		const isScrollable = scrollHeight > clientHeight;

		if (isScrollable) {
			const isAtTop = scrollTop === 0;
			const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

			// Scrolling up and at the top, or scrolling down and at the bottom
			if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
				// Let the parent handle the scroll
				return;
			}

			// Otherwise prevent default and handle the scroll ourselves
			e.stopPropagation();
		}
	}, []);

	// Prevent body scrolling when popup is open
	useEffect(() => {
		if (isOpen) {
			// Save the current overflow style
			const originalStyle = window.getComputedStyle(document.body).overflow;
			// Prevent scrolling on the body
			document.body.style.overflow = 'hidden';

			// Restore original overflow on cleanup
			return () => {
				document.body.style.overflow = originalStyle;
			};
		}
	}, [isOpen]);

	return {
		contentRef: setContentRef,
		handleWheel,
	};
};

export default usePopupScroll;

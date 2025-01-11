'use client';
import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { cancelFrame, frame } from 'motion';
import { useEffect, useRef } from 'react';

const LenisWrapper = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const lenisRef = useRef<LenisRef>(null);

	useEffect(() => {
		function update(data: { timestamp: number }) {
			const time = data.timestamp;
			lenisRef.current?.lenis?.raf(time);
		}

		frame.update(update, true);

		return () => cancelFrame(update);
	}, []);

	return (
		<ReactLenis options={{ autoRaf: false }} ref={lenisRef}>
			{children}
		</ReactLenis>
	);
};

export default LenisWrapper;

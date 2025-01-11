'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

import { ReactNode } from 'react';

interface LenisWrapperProps {
	children: ReactNode;
}

export default function LenisWrapper({ children }: LenisWrapperProps) {
	useEffect(() => {
		const lenis = new Lenis();

		const raf = (time: number) => {
			lenis.raf(time);
			requestAnimationFrame(raf);
		};

		requestAnimationFrame(raf);
	}, []);
	return <>{children}</>;
}

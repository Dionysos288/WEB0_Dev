// 'use client';
// import { useState } from 'react';
import Layout from './Layout';

export default function LayoutClient({
	children,
}: {
	children: React.ReactNode;
}) {
	// const [isOpenLeftBar, setIsOpenLeftBar] = useState(true);
	// const [isOpenRightBar, setIsOpenRightBar] = useState(true);
	const isOpenRightBar = false;
	const isOpenLeftBar = true;
	const widthLeftbar = '212px';
	const widthRightbar = '280px';

	return (
		<Layout
			isOpenLeftBar={isOpenLeftBar}
			isOpenRightBar={isOpenRightBar}
			widthLeftbar={widthLeftbar}
			widthRightbar={widthRightbar}
		>
			{children}
		</Layout>
	);
}

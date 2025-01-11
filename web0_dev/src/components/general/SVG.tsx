const SVG = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <button style={{ padding: '4px' }}>{children}</button>;
};

export default SVG;

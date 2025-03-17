'use client';

import SVG from '@components/general/SVG';
import Sun from '@/svgs/Sun';
import { useTheme } from 'next-themes';

const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	return (
		<SVG isButton onClick={toggleTheme}>
			<Sun fill="var(--main)" width="20" height="20" />
		</SVG>
	);
};

export default ThemeToggle;

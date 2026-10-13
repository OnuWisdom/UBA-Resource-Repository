import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
			title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
			className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:text-slate-300 dark:hover:bg-slate-800"
		>
			{theme === 'dark' ? (
				<Sun size={18} className="text-yellow-300" />
			) : (
				<Moon size={18} className="text-red-500" />
			)}
		</button>
	);
}

export default ThemeToggle;

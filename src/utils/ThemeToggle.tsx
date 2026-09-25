import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			aria-label="Toggle dark mode"
			className="p-2 rounded-md hover:bg-slate-700/50 dark:hover:bg-slate-600/50 transition-colors"
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

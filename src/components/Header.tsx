import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from '../utils/ThemeToggle';

const navigation = [
	{ label: 'Home', to: '/' },
	{ label: 'Resources', to: '/resources' },
	{ label: 'Favorites', to: '/favorites' },
	{ label: 'Departments', to: '/department' },
	{ label: 'Functions', to: '/functions' },
	{ label: 'Feedback', to: '/feedback' },
	{ label: 'About', to: '/about' },
];

function Header() {
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	const navLinkClass = ({ isActive }: { isActive: boolean }) =>
		`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
			isActive
				? 'bg-red-50 text-[#c8102e] dark:bg-red-950/50 dark:text-red-300'
				: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
		}`;

	const logOut = () => {
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('display_name');
		sessionStorage.removeItem('welcome_modal_dismissed');
		navigate('/login', { replace: true });
	};

	return (
		<div className="border-b border-slate-200/80 bg-white/95 text-slate-900 shadow-sm shadow-slate-900/3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-100">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<Link
					to="/"
					className="group flex min-w-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
					aria-label="UBA Digital Resource Repository home"
				>
					<span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 ring-1 ring-red-100 dark:bg-red-950/50 dark:ring-red-900">
						<img src="/seed.png" alt="" width={28} height={28} />
					</span>
					<span className="block min-w-0">
						<span className="block truncate text-xs font-bold tracking-tight text-slate-900 dark:text-white sm:text-sm">
							UBA Resource Hub
						</span>
						<span className="hidden truncate text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:block">
							Digital resources, all in one place
						</span>
					</span>
				</Link>

				<nav
					aria-label="Main navigation"
					className="hidden items-center gap-1 lg:flex"
				>
					{navigation.map(({ label, to }) => (
						<NavLink key={to} to={to} end={to === '/'} className={navLinkClass}>
							{label}
						</NavLink>
					))}
				</nav>

				<div className="flex shrink-0 items-center gap-1">
					<ThemeToggle />
					<button
						type="button"
						onClick={logOut}
						aria-label="Sign out"
						title="Sign out"
						className="hidden h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#c8102e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-300 lg:inline-flex"
					>
						<LogOut size={17} aria-hidden="true" />
						<span className="hidden lg:inline">Sign out</span>
					</button>
					<button
						type="button"
						onClick={() => setMenuOpen((open) => !open)}
						aria-expanded={menuOpen}
						aria-controls="mobile-navigation"
						aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
						className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
					>
						{menuOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>

			{menuOpen && (
				<nav
					id="mobile-navigation"
					aria-label="Mobile navigation"
					className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 lg:hidden"
				>
					<div className="mx-auto flex max-w-7xl flex-col gap-1">
						{navigation.map(({ label, to }) => (
							<NavLink
								key={to}
								to={to}
								end={to === '/'}
								onClick={() => setMenuOpen(false)}
								className={navLinkClass}
							>
								{label}
							</NavLink>
						))}
						<button
							type="button"
							onClick={logOut}
							className="mt-1 inline-flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[#c8102e] dark:text-slate-300 dark:hover:bg-slate-800"
						>
							<LogOut size={16} aria-hidden="true" />
							Sign out
						</button>
					</div>
				</nav>
			)}
		</div>
	);
}

export default Header;

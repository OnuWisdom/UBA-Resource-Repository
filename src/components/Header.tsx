import { LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from '../utils/ThemeToggle';

function Header() {
	const navigate = useNavigate();
	return (
		<div className="header flex justify-around items-center bg-white dark:bg-slate-900 text-black dark:text-slate-100 p-4 border-b border-transparent dark:border-slate-800">
			<div className="hover:text-[#d70900] dark:hover:text-[#e8495f]">
				UBA Resource Repository
			</div>

			<nav className="flex space-x-6">
				<NavLink
					to="/"
					className={({ isActive }) =>
						`hover:text-[#c8102e] dark:hover:text-[#e8495f] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black dark:text-slate-200'}`
					}
				>
					Home
				</NavLink>

				<NavLink
					to="/resources"
					className={({ isActive }) =>
						`hover:text-[#c8102e] dark:hover:text-[#e8495f] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black dark:text-slate-200'}`
					}
				>
					Resource
				</NavLink>
				<NavLink
					to="/department"
					className={({ isActive }) =>
						`hover:text-[#c8102e] dark:hover:text-[#e8495f] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black dark:text-slate-200'}`
					}
				>
					Department
				</NavLink>
				<NavLink
					to="/functions"
					className={({ isActive }) =>
						`hover:text-[#c8102e] dark:hover:text-[#e8495f] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black dark:text-slate-200'}`
					}
				>
					Function
				</NavLink>
				<NavLink
					to="/feedback"
					className={({ isActive }) =>
						`hover:text-[#c8102e] dark:hover:text-[#e8495f] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black dark:text-slate-200'}`
					}
				>
					Feedback
				</NavLink>
				{/* <NavLink
					to="/resource-types"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black'}`
					}
				>
					Resource Type
				</NavLink> */}
				<NavLink
					to="/about"
					className={({ isActive }) =>
						`hover:text-[#c8102e] dark:hover:text-[#e8495f] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black dark:text-slate-200'}`
					}
				>
					About
				</NavLink>
			</nav>

			<div className="flex relative items-center">
				<img src="/seed.png" alt="UBA Logo" width={40} height={40} />
				<LogOut
					size={20}
					className="absolute -right-20 cursor-pointer text-black dark:text-slate-200"
					onClick={() => {
						const token = sessionStorage.getItem('token');
						if (token) {
							sessionStorage.removeItem('token');
							sessionStorage.removeItem('display_name');
							sessionStorage.removeItem('welcome_modal_dismissed');
							// alert('Logout Successful');
							navigate('/login', { replace: true });
						}
					}}
				/>

				<ThemeToggle />
			</div>
		</div>
	);
}
export default Header;

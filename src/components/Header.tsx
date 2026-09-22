import { LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Header() {
	return (
		<div className="header flex justify-around items-center bg-gray-800 text-white p-4">
			<div className="hover:text-[#d70900]">UBA Resource Repository</div>

			<nav className="flex space-x-6">
				<NavLink
					to="/"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-white'}`
					}
				>
					Home
				</NavLink>
				<NavLink
					to="/resources"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-white'}`
					}
				>
					Resource
				</NavLink>
				<NavLink
					to="/department"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-white'}`
					}
				>
					Department
				</NavLink>
				<NavLink
					to="/functions"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-white'}`
					}
				>
					Function
				</NavLink>
				<NavLink
					to="/resource-types"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-white'}`
					}
				>
					Resource Type
				</NavLink>
				<NavLink
					to="/about"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-white'}`
					}
				>
					About
				</NavLink>
			</nav>

			<div className="flex relative items-center">
				<img src="/uba.png" alt="UBA Logo" width={100} height={100} />
				<LogOut
					size={20}
					className="absolute -right-20 cursor-pointer"
					onClick={() => {
						const token = localStorage.getItem('token');
						if (token) {
							localStorage.removeItem('token');
							alert('Logout Successful');
						}
					}}
				/>
			</div>
		</div>
	);
}
export default Header;

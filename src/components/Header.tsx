import { LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

function Header() {
	const navigate = useNavigate();
	return (
		<div className="header flex justify-around items-center bg-white text-black p-4">
			<div className="hover:text-[#d70900]">UBA Resource Repository</div>

			<nav className="flex space-x-6">
				<NavLink
					to="/"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black'}`
					}
				>
					Home
				</NavLink>

				<NavLink
					to="/resources"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black'}`
					}
				>
					Resource
				</NavLink>
				<NavLink
					to="/department"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black'}`
					}
				>
					Department
				</NavLink>
				<NavLink
					to="/functions"
					className={({ isActive }) =>
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black'}`
					}
				>
					Function
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
						`hover:text-[#c8102e] transition-colors ${isActive ? 'text-[#c8102e] font-bold' : 'text-black'}`
					}
				>
					About
				</NavLink>
			</nav>

			<div className="flex relative items-center">
				<img src="/uba.png" alt="UBA Logo" width={40} height={40} />
				<LogOut
					size={20}
					className="absolute -right-20 cursor-pointer"
					onClick={() => {
						const token = sessionStorage.getItem('token');
						if (token) {
							sessionStorage.removeItem('token');
							// alert('Logout Successful');
							navigate('/login', { replace: true });
						}
					}}
				/>
			</div>
		</div>
	);
}
export default Header;

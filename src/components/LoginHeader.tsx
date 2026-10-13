import { Link } from 'react-router-dom';

function LoginHeader() {
	return (
		<div className="flex items-center justify-between">
			<Link
				to="/login"
				className="flex items-center gap-3 rounded-lg text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
				aria-label="UBA Resource Repository"
			>
				<img src="/seed.png" alt="" width={42} height={42} />
				<span className="leading-tight">
					<span className="block text-sm font-bold tracking-wide">UBA</span>
					<span className="block text-xs font-medium text-white/75">
						Resource Repository
					</span>
				</span>
			</Link>
			<span className="hidden rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 sm:inline-flex">
				For UBA employees
			</span>
		</div>
	);
}

export default LoginHeader;

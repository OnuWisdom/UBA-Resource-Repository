function LoginHeader() {
	return (
		<div className="flex items-center justify-between px-48 w-full gap-3">
			<div className="flex flex-col leading-none text-white">
				<span className="text-sm font-extrabold tracking-[-0.04em]">UBA</span>

				<span className="mt-1 text-xs font-semibold uppercase tracking-[0.18em]">
					Resource
				</span>

				<span className="text-xs font-semibold uppercase tracking-[0.18em]">
					Repository
				</span>
			</div>
			<img src="/seed.png" alt="UBA Logo" width={40} height={40} />
		</div>
	);
}
export default LoginHeader;

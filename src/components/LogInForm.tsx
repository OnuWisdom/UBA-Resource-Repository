export default function Login() {
	return (
		<div>
			<h1 className="text-[30px] font-normal text-black">Welcome Back</h1>

			<p className="text-[16px] text-black mt-1 mb-7">
				Please login to your account
			</p>

			<div className="mb-1">
				<label className="block text-[18px] text-black mb-1">Username</label>

				<input
					type="text"
					value=""
					placeholder="Enter your email"
					className="w-full h-12 border border-[#b9c9dc] rounded-md px-3 text-[18px] text-[#34495e] outline-none"
				/>
			</div>

			<div className="mb-1">
				<label className="block text-[18px] text-black mb-1">Password</label>

				<input
					type="password"
					placeholder="Enter your password"
					className="w-full h-12 border border-[#b9c9dc] rounded-md px-3 text-[18px] placeholder:text-[#b8c8da] outline-none"
				/>
			</div>

			<div className="mb-2">
				<label className="block text-[18px] text-black mb-1">Token</label>

				<input
					type="text"
					placeholder="12345678"
					className="w-full h-12 border border-[#b9c9dc] rounded-md px-3 text-[18px] placeholder:text-[#b8c8da] outline-none"
				/>
			</div>

			<label className="flex items-center gap-1.5 text-[18px] text-black cursor-pointer">
				<input
					type="checkbox"
					defaultChecked
					className="w-4.5 h-4.5 accent-blue-600"
				/>
				Remember Me
			</label>

			<button
				type="submit"
				className="w-full h-12 mt-16 bg-[#d70900] hover:bg-[#c90500] text-white text-[18px] rounded-md transition"
			>
				Sign In
			</button>
		</div>
	);
}

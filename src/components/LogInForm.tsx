import React, { useState } from 'react';
import { loginService, tokenService } from '../services/loginService';

export default function Login() {
	const [loginData, setLoginData] = useState({
		username: '',
		password: '',
	});
	const [otp, setOtp] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [step, setStep] = useState<'login' | 'token'>('login');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const data = await loginService({
				username: loginData.username,
				password: loginData.password,
			});
			console.log(data);
			localStorage.setItem('token', data.pending_token);

			setStep('token');
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Something Happened');
		} finally {
			setLoading(false);
		}
	};

	const handleTokenValidation = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const tokenData = localStorage.getItem('token');
			if (!tokenData) {
				throw new Error('No token found. Please log in again.');
			}
			const data = await tokenService({
				pending_token: tokenData,
				otp,
			});

			console.log(data);
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Something Happened');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{step === 'login' ? (
				<form onSubmit={handleSubmit}>
					<h1 className="text-[30px] font-normal text-black">Welcome Back</h1>

					<p className="text-[16px] text-black mt-1 mb-7">
						Please login to your account
					</p>

					{error && (
						<div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
					)}

					<div className="mb-1">
						<label className="block text-[18px] text-black mb-1">Username</label>

						<input
							type="text"
							name="username"
							value={loginData.username}
							placeholder="Enter your username"
							className="w-full h-12 border border-[#b9c9dc] rounded-md px-3 text-[18px] text-[#34495e] outline-none"
							onChange={handleChange}
						/>
					</div>

					<div className="mb-1">
						<label className="block text-[18px] text-black mb-1">Password</label>

						<input
							type="password"
							name="password"
							value={loginData.password}
							placeholder="Enter your password"
							className="w-full h-12 border border-[#b9c9dc] rounded-md px-3 text-[18px] placeholder:text-[#b8c8da] outline-none"
							onChange={handleChange}
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
						className="w-full h-12 mt-16 bg-[#d70900] hover:bg-[#c90500] text-white text-[18px] rounded-md transition disabled:cursor-not-allowed"
						disabled={loading}
					>
						{loading ? 'Loggin In' : 'Log in'}
					</button>
				</form>
			) : (
				<form onSubmit={handleTokenValidation}>
					<div className="mb-2">
						<label className="block text-[18px] text-black mb-1">Token</label>

						<input
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							name="otp"
							value={otp}
							placeholder="12345678"
							className="w-full h-12 border border-[#b9c9dc] rounded-md px-3 text-[18px] placeholder:text-[#b8c8da] outline-none"
							onChange={(e) => setOtp(e.target.value)}
						/>
					</div>

					<button
						type="submit"
						className="w-full h-12 mt-16 bg-[#d70900] hover:bg-[#c90500] text-white text-[18px] rounded-md transition disabled:cursor-not-allowed"
						disabled={loading}
					>
						{loading ? 'Loggin In' : 'Log in'}
					</button>
				</form>
			)}
		</>
	);
}

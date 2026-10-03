import React, { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { loginService, tokenService } from '../services/loginService';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const [loginData, setLoginData] = useState({
		username: '',
		password: '',
	});
	const [otp, setOtp] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<{
		username?: string;
		password?: string;
		otp?: string;
	}>({});
	const [step, setStep] = useState<'login' | 'token'>('login');

	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const nextFieldErrors: typeof fieldErrors = {};
		if (!loginData.username.trim()) {
			nextFieldErrors.username = 'Username is required.';
		}
		if (!loginData.password) {
			nextFieldErrors.password = 'Password is required.';
		}
		setFieldErrors(nextFieldErrors);
		if (Object.keys(nextFieldErrors).length > 0) return;

		setLoading(true);
		setError(null);

		try {
			const data = await loginService({
				username: loginData.username,
				password: loginData.password,
			});
			console.log(data);
			sessionStorage.setItem('pending_token', data.pending_token);

			setStep('token');
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Something Happened');
		} finally {
			setLoading(false);
		}
	};

	const handleTokenValidation = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!otp.trim()) {
			setFieldErrors((prevErrors) => ({ ...prevErrors, otp: 'Token is required.' }));
			return;
		}
		setFieldErrors((prevErrors) => ({ ...prevErrors, otp: undefined }));
		setLoading(true);
		setError(null);

		try {
			const tokenData = sessionStorage.getItem('pending_token');
			if (!tokenData) {
				throw new Error('No token found. Please log in again.');
			}
			const data = await tokenService({
				pending_token: tokenData,
				otp,
			});

			sessionStorage.setItem('token', data.token);
			sessionStorage.removeItem('pending_token');
			navigate('/', { replace: true });
			console.log('pending-token', data);
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Something Happened');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{step === 'login' ? (
				<form onSubmit={handleSubmit} noValidate>
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
							required
							aria-invalid={Boolean(fieldErrors.username)}
							aria-describedby={fieldErrors.username ? 'username-error' : undefined}
							placeholder="Enter your username"
							className="w-full h-12 bg-white border border-slate-300 rounded-md px-3 text-base text-slate-700 outline-none focus:ring-2 focus:ring-[#c8102e]/40 focus:border-[#c8102e] transition-colors"
							onChange={handleChange}
						/>
						{fieldErrors.username && (
							<p id="username-error" className="mt-1 text-sm text-red-700" role="alert">
								{fieldErrors.username}
							</p>
						)}
					</div>

					<div className="mb-1">
						<label className="block text-[18px] text-black mb-1">Password</label>

						<input
							type="password"
							name="password"
							value={loginData.password}
							required
							aria-invalid={Boolean(fieldErrors.password)}
							aria-describedby={fieldErrors.password ? 'password-error' : undefined}
							placeholder="Enter your password"
							className="w-full h-12 bg-white border border-slate-300 rounded-md px-3 text-base text-slate-700 outline-none focus:ring-2 focus:ring-[#c8102e]/40 focus:border-[#c8102e] transition-colors"
							onChange={handleChange}
						/>
						{fieldErrors.password && (
							<p id="password-error" className="mt-1 text-sm text-red-700" role="alert">
								{fieldErrors.password}
							</p>
						)}
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
						className="w-full h-12 mt-8 bg-[#d70900] hover:bg-[#c90500] text-white text-[18px] rounded-md transition disabled:cursor-not-allowed flex items-center justify-center gap-2"
						disabled={loading}
						aria-busy={loading}
					>
						{loading && <LoaderCircle size={20} className="animate-spin" aria-hidden="true" />}
						{loading ? 'Authenticating...' : 'Log in'}
					</button>
				</form>
			) : (
				<form onSubmit={handleTokenValidation} noValidate>
					<div className="mb-2">
						<label className="block text-[18px] text-black mb-1">Token</label>

						<input
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							name="otp"
							value={otp}
							required
							aria-invalid={Boolean(fieldErrors.otp)}
							aria-describedby={fieldErrors.otp ? 'token-error' : undefined}
							placeholder="12345678"
							className="w-full h-12 border border-[#b9c9dc] rounded-md px-3 text-[18px] placeholder:text-[#b8c8da] outline-none"
							onChange={(e) => {
								setOtp(e.target.value);
								setFieldErrors((prevErrors) => ({ ...prevErrors, otp: undefined }));
							}}
						/>
						{fieldErrors.otp && (
							<p id="token-error" className="mt-1 text-sm text-red-700" role="alert">
								{fieldErrors.otp}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full h-12 mt-16 bg-[#d70900] hover:bg-[#c90500] text-white text-[18px] rounded-md transition disabled:cursor-not-allowed flex items-center justify-center gap-2"
						disabled={loading}
						aria-busy={loading}
					>
						{loading && <LoaderCircle size={20} className="animate-spin" aria-hidden="true" />}
						{loading ? 'Signing In' : 'Log in'}
					</button>
				</form>
			)}
		</>
	);
}

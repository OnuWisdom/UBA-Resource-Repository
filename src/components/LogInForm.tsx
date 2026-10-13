import React, { useState } from 'react';
import { CircleAlert, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { loginService, tokenService } from '../services/loginService';
import { useNavigate } from 'react-router-dom';

function getDisplayName(username: string) {
	const usernamePart = username.trim().split('@')[0] ?? '';
	const firstName = usernamePart.split(/[._\-\s]+/)[0] ?? '';
	return firstName
		? `${firstName.charAt(0).toLocaleUpperCase()}${firstName.slice(1).toLocaleLowerCase()}`
		: '';
}

export default function Login() {
	const [loginData, setLoginData] = useState({
		username: '',
		password: '',
	});
	const [otp, setOtp] = useState<string>('');
	const [showPassword, setShowPassword] = useState(false);
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
		setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
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
			setError(
				error instanceof TypeError
					? 'We couldn’t connect to the sign-in service. Check your connection and try again.'
					: error instanceof Error
						? error.message
						: 'We couldn’t sign you in. Please try again.',
			);
		} finally {
			setLoading(false);
		}
	};

	const handleTokenValidation = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!otp.trim()) {
			setFieldErrors((prevErrors) => ({
				...prevErrors,
				otp: 'Token is required.',
			}));
			return;
		}
		if (otp.trim().length > 8) {
			setFieldErrors((prevErrors) => ({
				...prevErrors,
				otp: 'Token must be 8 characters or less.',
			}));
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

			const displayName = getDisplayName(loginData.username);
			sessionStorage.removeItem('welcome_modal_dismissed');
			if (displayName) sessionStorage.setItem('display_name', displayName);
			sessionStorage.setItem('token', data.token);
			sessionStorage.removeItem('pending_token');
			navigate('/', { replace: true });
			console.log('pending-token', data);
		} catch (error) {
			setError(
				error instanceof TypeError
					? 'We couldn’t connect to the verification service. Check your connection and try again.'
					: error instanceof Error
						? error.message
						: 'We couldn’t verify that code. Please try again.',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{step === 'login' ? (
				<form onSubmit={handleSubmit} noValidate>
					<h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[30px]">
						Welcome back
					</h1>

					<p className="mb-7 mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
						Sign in with your UBA account to continue.
					</p>

					{error && (
						<div
							className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
							role="alert"
							aria-live="polite"
						>
							<CircleAlert size={18} className="mt-0.5 shrink-0" />
							<p>{error}</p>
						</div>
					)}

					<div className="mb-1">
						<label className="mb-1.5 block text-sm font-medium text-slate-700">
							Username
						</label>

						<input
							type="text"
							name="username"
							value={loginData.username}
							required
							aria-invalid={Boolean(fieldErrors.username)}
							aria-describedby={fieldErrors.username ? 'username-error' : undefined}
							placeholder="Enter your username"
							className="h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/25"
							onChange={handleChange}
						/>
						{fieldErrors.username && (
							<p
								id="username-error"
								className="mt-1 text-sm text-red-700"
								role="alert"
							>
								{fieldErrors.username}
							</p>
						)}
					</div>

					<div className="mb-1">
						<label className="mb-1.5 block text-sm font-medium text-slate-700">
							Password
						</label>

						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={loginData.password}
								required
								aria-invalid={Boolean(fieldErrors.password)}
								aria-describedby={fieldErrors.password ? 'password-error' : undefined}
								placeholder="Enter your password"
								className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-3 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/25"
								onChange={handleChange}
							/>
							<button
								type="button"
								onClick={() => setShowPassword((visible) => !visible)}
								className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-[#c8102e] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c8102e]"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								aria-pressed={showPassword}
							>
								{showPassword ? (
									<EyeOff size={20} aria-hidden="true" />
								) : (
									<Eye size={20} aria-hidden="true" />
								)}
							</button>
						</div>
						{fieldErrors.password && (
							<p
								id="password-error"
								className="mt-1 text-sm text-red-700"
								role="alert"
							>
								{fieldErrors.password}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#c8102e] text-sm font-semibold text-white transition hover:bg-[#a80d26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
						disabled={loading}
						aria-busy={loading}
					>
						{loading && (
							<LoaderCircle size={20} className="animate-spin" aria-hidden="true" />
						)}
						{loading ? 'Authenticating...' : 'Log in'}
					</button>
				</form>
			) : (
				<form onSubmit={handleTokenValidation} noValidate>
					<h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[30px]">
						Verify your sign-in
					</h1>
					<p className="mb-7 mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
						Enter the 8-digit code sent by Entrust.
					</p>

					{error && (
						<div
							className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
							role="alert"
							aria-live="polite"
						>
							<CircleAlert size={18} className="mt-0.5 shrink-0" />
							<p>{error}</p>
						</div>
					)}

					<div className="mb-2">
						<label className="mb-1.5 block text-sm font-medium text-slate-700">
							Verification code
						</label>

						<input
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							maxLength={8}
							name="otp"
							value={otp}
							required
							aria-invalid={Boolean(fieldErrors.otp)}
							aria-describedby={fieldErrors.otp ? 'token-error' : undefined}
							placeholder="12345678"
							className="h-12 w-full rounded-lg border border-slate-300 px-3 text-base tracking-[0.2em] text-slate-800 outline-none transition placeholder:tracking-[0.2em] placeholder:text-slate-400 focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/25"
							onChange={(e) => {
								setOtp(e.target.value);
								setFieldErrors((prevErrors) => ({ ...prevErrors, otp: undefined }));
								setError(null);
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
						className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#c8102e] text-sm font-semibold text-white transition hover:bg-[#a80d26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
						disabled={loading}
						aria-busy={loading}
					>
						{loading && (
							<LoaderCircle size={20} className="animate-spin" aria-hidden="true" />
						)}
						{loading ? 'Signing In' : 'Log in'}
					</button>
				</form>
			)}
		</>
	);
}

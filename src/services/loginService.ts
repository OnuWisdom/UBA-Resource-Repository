import { BASE_URL } from './../utils/config';

type LoginPayload = {
	username: string;
	password: string;
};

type TokenPayload = {
	pending_token: string;
	otp: string;
};

export async function loginService(payLoad: LoginPayload) {
	const payload = {
		password: payLoad.password,
		username: payLoad.username.trim().toLowerCase(),
	};
	const response = await fetch(`${BASE_URL}/api/auth/login/`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		// const errorData = await response.json().catch(() => null)
		throw new Error('Login Failed');
	}

	return await response.json();
}

export const tokenService = async (token: TokenPayload) => {
	const response = await fetch(`${BASE_URL}/api/auth/verify-otp/`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(token),
	});

	if (!response.ok) {
		// const errorData = await response.json().catch(() => null)
		throw new Error('Login Failed');
	}

	return response.json();
};

import { BASE_URL } from './../utils/config';

type LoginPayload = {
	username: string;
	password: string;
};

type TokenPayload = {
	pending_token: string;
	otp: string;
};

function getResponseErrorMessage(payload: unknown) {
	if (!payload || typeof payload !== 'object') return undefined;

	const body = payload as Record<string, unknown>;
	for (const key of ['detail', 'message', 'error', 'non_field_errors']) {
		const value = body[key];
		if (typeof value === 'string' && value.trim()) return value;
		if (Array.isArray(value)) {
			const message = value.find(
				(item): item is string => typeof item === 'string' && item.trim().length > 0,
			);
			if (message) return message;
		}
	}

	const errors = body.errors;
	if (errors && typeof errors === 'object') {
		for (const value of Object.values(errors)) {
			if (typeof value === 'string' && value.trim()) return value;
			if (Array.isArray(value)) {
				const message = value.find(
					(item): item is string =>
						typeof item === 'string' && item.trim().length > 0,
				);
				if (message) return message;
			}
		}
	}

	return undefined;
}

async function throwAuthError(response: Response, fallbackMessage: string): Promise<never> {
	const responseText = await response.text();
	if (responseText) {
		let payload: unknown;
		try {
			payload = JSON.parse(responseText) as unknown;
		} catch {
			throw new Error(fallbackMessage);
		}
		const message = getResponseErrorMessage(payload);
		if (message) throw new Error(message);
	}

	throw new Error(fallbackMessage);
}

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
		await throwAuthError(
			response,
			'Those login details weren’t recognized. Check your username and password, then try again.',
		);
	}

	const data: unknown = await response.json();
	if (
		!data ||
		typeof data !== 'object' ||
		typeof (data as Record<string, unknown>).pending_token !== 'string'
	) {
		throw new Error('We could not start sign-in. Please try again.');
	}

	return data as { pending_token: string };
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
		await throwAuthError(
			response,
			'That verification code wasn’t accepted. Check the code and try again.',
		);
	}

	const data: unknown = await response.json();
	if (
		!data ||
		typeof data !== 'object' ||
		typeof (data as Record<string, unknown>).token !== 'string'
	) {
		throw new Error('We could not verify that code. Please try again.');
	}

	return data as { token: string };
};

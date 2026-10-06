import { BASE_URL } from './../utils/config';

export interface ResourceSearchRef {
	id: number;
	name: string;
	slug: string;
}

export interface ResourceSearchResult {
	id: number;
	name: string;
	slug: string;
	description: string;
	url: string;
	departments: ResourceSearchRef[];
	functions: ResourceSearchRef[];
	resource_types: ResourceSearchRef[];
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface ResourceSubmissionPayload {
	name: string;
	description: string;
	url: string;
	resource_type: number;
	departments: number[];
	functions: number[];
	submitter_name: string;
	contact_email: string;
}

export type SubmissionCategory = number | ResourceSearchRef;

export interface ResourceSubmission
	extends Omit<ResourceSubmissionPayload, 'resource_type' | 'departments' | 'functions'> {
	id: number;
	resource_type: SubmissionCategory;
	departments: SubmissionCategory[];
	functions: SubmissionCategory[];
	created_at?: string;
	status?: string;
	approval_status?: string;
	review_status?: string;
}

function getSubmissionError(payload: unknown): string | undefined {
	if (!payload || typeof payload !== 'object') return undefined;
	const body = payload as Record<string, unknown>;

	for (const key of ['detail', 'message', 'error', 'non_field_errors']) {
		const value = body[key];
		if (typeof value === 'string' && value.trim()) return value;
		if (Array.isArray(value)) {
			const messages = value.filter(
				(item): item is string =>
					typeof item === 'string' && item.trim().length > 0,
			);
			if (messages.length) return messages.join(' ');
		}
	}

	const fieldMessages = Object.entries(body).flatMap(([field, value]) => {
		if (typeof value === 'string' && value.trim()) return [`${field}: ${value}`];
		if (Array.isArray(value)) {
			return value
				.filter(
					(item): item is string =>
						typeof item === 'string' && item.trim().length > 0,
				)
				.map((message) => `${field}: ${message}`);
		}
		return [];
	});

	return fieldMessages.length ? fieldMessages.join(' ') : undefined;
}

function parseResourceList(payload: unknown): ResourceSearchResult[] {
	if (Array.isArray(payload)) {
		return payload as ResourceSearchResult[];
	}

	if (
		payload &&
		typeof payload === 'object' &&
		Array.isArray((payload as { results?: unknown }).results)
	) {
		return (payload as { results: ResourceSearchResult[] }).results;
	}

	throw new Error('The resource service returned an unsupported response.');
}

export async function getDepartmentService() {
	const response = await fetch(`${BASE_URL}/api/resources/departments/`);

	if (!response.ok) {
		// const errorData = await response.json().catch(() => null)
		throw new Error('cannot get department');
	}

	return await response.json();
}

export async function getFunctionService() {
	const response = await fetch(`${BASE_URL}/api/resources/functions/`);

	if (!response.ok) {
		// const errorData = await response.json().catch(() => null)
		throw new Error('cannot get function');
	}

	return await response.json();
}

export async function getResourceService() {
	const response = await fetch(`${BASE_URL}/api/resources/types/`);

	if (!response.ok) {
		// const errorData = await response.json().catch(() => null)
		throw new Error('cannot get resource type');
	}

	return await response.json();
}

export async function getResourcesService(): Promise<ResourceSearchResult[]> {
	const response = await fetch(`${BASE_URL}/api/resources/`);

	if (!response.ok) {
		throw new Error('Unable to load resources.');
	}

	return parseResourceList(await response.json());
}

export async function createResourceSubmissionService(
	payload: ResourceSubmissionPayload,
): Promise<number | null> {
	const token = sessionStorage.getItem('token');
	if (!token) {
		throw new Error(
			'Your session has expired. Please sign in again to submit a resource.',
		);
	}

	const response = await fetch(`${BASE_URL}/api/submissions/`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			Authorization: `Token ${token}`,
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const responseText = await response.text();
		let message: string | undefined;
		if (responseText) {
			try {
				message = getSubmissionError(JSON.parse(responseText) as unknown);
			} catch {
				message = undefined;
			}
		}

		if (message) {
			throw new Error(message);
		}

		if (response.status === 401) {
			throw new Error(
				'The submission service rejected your authentication (401). Your session token may be expired or the API may expect a different Authorization scheme.',
			);
		}

		if (response.status === 403) {
			throw new Error(
				'The submission service understood your request but denied permission (403). Your account may not be allowed to submit resources.',
			);
		}

		throw new Error(
			`We couldn’t submit this resource suggestion (HTTP ${response.status}). Please try again.`,
		);
	}

	const responseText = await response.text();
	if (!responseText) return null;

	try {
		const result: unknown = JSON.parse(responseText);
		if (
			result &&
			typeof result === 'object' &&
			typeof (result as Record<string, unknown>).id === 'number'
		) {
			return (result as Record<string, number>).id;
		}
	} catch {
		return null;
	}

	return null;
}

export async function getMySubmissionsService(): Promise<ResourceSubmission[]> {
	const token = sessionStorage.getItem('token');
	if (!token) {
		throw new Error('Your session has expired. Please sign in again.');
	}

	const response = await fetch(`${BASE_URL}/api/submissions/`, {
		headers: {
			Authorization: `Token ${token}`,
		},
	});

	if (!response.ok) {
		const responseText = await response.text();
		let message: string | undefined;
		if (responseText) {
			try {
				message = getSubmissionError(JSON.parse(responseText) as unknown);
			} catch {
				message = undefined;
			}
		}

		if (message) throw new Error(message);
		if (response.status === 401) {
			throw new Error('Your session has expired or could not be verified. Please sign in again.');
		}
		if (response.status === 403) {
			throw new Error('You do not have permission to view these submissions.');
		}
		throw new Error(`Unable to load your submissions (HTTP ${response.status}).`);
	}

	const data: unknown = await response.json();
	if (!Array.isArray(data)) {
		throw new Error('The submissions service returned an unsupported response.');
	}

	return data as ResourceSubmission[];
}

export async function getDepartmentBySlugService(slug: string) {
	const response = await fetch(`${BASE_URL}/api/resources/departments/${slug}/`);

	if (!response.ok) {
		throw new Error('cannot get department details');
	}

	return await response.json();
}

export async function getFunctionBySlugService(slug: string) {
	const response = await fetch(`${BASE_URL}/api/resources/functions/${slug}/`);

	if (!response.ok) {
		throw new Error('cannot get function details');
	}

	return await response.json();
}

export async function getResourceTypeBySlugService(slug: string) {
	const response = await fetch(`${BASE_URL}/api/resources/types/${slug}/`);

	if (!response.ok) {
		throw new Error('cannot get resource type details');
	}

	return await response.json();
}

export async function searchResourceService(
	search: string,
): Promise<ResourceSearchResult[]> {
	const response = await fetch(
		`${BASE_URL}/api/resources/?search=${encodeURIComponent(search)}`,
	);

	if (!response.ok) {
		// const errorData = await response.json().catch(() => null)
		throw new Error('Failed to fetch Search resources');
	}

	return (await response.json()) as ResourceSearchResult[];
}

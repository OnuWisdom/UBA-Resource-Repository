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

export async function searchResourceService(search: string): Promise<ResourceSearchResult[]> {
	const response = await fetch(
		`${BASE_URL}/api/resources/?search=${encodeURIComponent(search)}`,
	);

	if (!response.ok) {
		// const errorData = await response.json().catch(() => null)
		throw new Error('Failed to fetch Search resources');
	}

	return (await response.json()) as ResourceSearchResult[];
}

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

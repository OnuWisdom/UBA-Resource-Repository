import { BASE_URL } from './../utils/config';

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
		throw new Error('cannot get department');
	}

	return await response.json();
}

export async function getResourceService() {
	const response = await fetch(`${BASE_URL}/api/resources/types/`);

	if (!response.ok) {
		// const errorData = await response.json().catch(() => null)
		throw new Error('cannot get department');
	}

	return await response.json();
}

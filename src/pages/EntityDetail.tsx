import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
	FileText,
	ArrowRight,
	CircleAlert,
	FileQuestion,
	LoaderCircle,
	Building2,
	ArrowLeft,
} from 'lucide-react';
import {
	getDepartmentBySlugService,
	getFunctionBySlugService,
	getResourceTypeBySlugService,
} from '../services/queryServices';

type ResourceItem = {
	id: number;
	name: string;
	slug: string;
	description: string;
	url: string;
	resource_types: Array<{ id: number; name: string; slug: string }>;
	functions: Array<{ id: number; name: string; slug: string }>;
	departments: Array<{ id: number; name: string; slug: string }>;
	is_active: boolean;
};

type EntityDetailResponse = {
	id: number;
	name: string;
	slug: string;
	description: string;
	resources: ResourceItem[];
};

type EntityRouteState = Pick<EntityDetailResponse, 'name' | 'slug' | 'description'>;

function EntityDetail() {
	const { type, slug } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const isDepartment = type === 'department';
	const isFunction = type === 'function' || type === 'functions';
	const isResourceType = type === 'resource-types' || type === 'resource-type';
	const routeEntity = (location.state as { entity?: EntityRouteState } | null)?.entity;
	const [entity, setEntity] = useState<EntityDetailResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const loadEntity = async () => {
			if (!type || !slug) {
				setError('Entity details could not be loaded.');
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);

				let data: EntityDetailResponse | null = null;

				if (isDepartment) {
					data = await getDepartmentBySlugService(slug);
				} else if (isFunction) {
					data = await getFunctionBySlugService(slug);
				} else if (isResourceType) {
					data = await getResourceTypeBySlugService(slug);
				} else {
					throw new Error('Unsupported resource category.');
				}

				if (!cancelled) {
					setEntity(data);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : 'Something went wrong');
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		loadEntity();
		return () => {
			cancelled = true;
		};
	}, [type, slug, location.state, isDepartment, isFunction, isResourceType]);

	const currentEntity =
		entity?.slug === slug
			? entity
			: routeEntity?.slug === slug
				? { ...routeEntity, id: 0, resources: [] }
				: null;
	const entityName =
		currentEntity?.name ??
		slug
			?.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ') ??
		'';
	const entityDescription = currentEntity?.description ?? '';
	const entityResources = currentEntity?.resources ?? [];
	const entityTypeLabel =
		isDepartment ? 'department' : isFunction ? 'function' : 'resource type';
	const parentLabel =
		isDepartment ? 'Departments' : isFunction ? 'Functions' : 'Resource Types';
	const parentPath =
		isDepartment ? '/department' : isFunction ? '/functions' : '/resources';

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
				<nav
					aria-label="Breadcrumb"
					className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400"
				>
					<Link
						to="/"
						className="rounded-sm hover:text-[#c8102e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
					>
						Home
					</Link>
					<span aria-hidden="true">›</span>
					<Link
						to={parentPath}
						className="rounded-sm hover:text-[#c8102e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
					>
						{parentLabel}
					</Link>
					<span aria-hidden="true">›</span>
					<span
						className="max-w-full break-words font-medium text-slate-700 dark:text-slate-300"
						aria-current="page"
					>
						{entityName}
					</span>
				</nav>

				<h1 className="break-words text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
					{entityName}
				</h1>
				<p className="mt-2 text-base leading-6 text-slate-500 dark:text-slate-400 sm:text-lg">
					{entityDescription}
				</p>

				<div className="mt-5 flex items-start gap-2 text-slate-600 dark:text-slate-300 sm:mt-6 sm:items-center">
					<div className="bg-red-50 p-2 rounded-md">
						<FileText className="text-[#c8102e]" size={18} />
					</div>
					<p className="text-sm font-medium sm:text-base">
						{loading
							? `Resources in this ${entityTypeLabel}`
							: `${entityResources.length} resource${entityResources.length === 1 ? '' : 's'} in this ${entityTypeLabel}`}
					</p>
				</div>
			</div>

			<div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12">
				{loading ? (
					<div
						className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400"
						role="status"
						aria-live="polite"
					>
						<LoaderCircle size={20} className="animate-spin text-[#c8102e]" />
						Loading resources...
					</div>
				) : error ? (
					<div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
						<CircleAlert size={18} />
						{error}
					</div>
				) : currentEntity ? (
					<>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
							{entityResources.map((resource) => (
						<div
							key={resource.id}
							className="flex h-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5"
						>
							<div className="flex items-start gap-3 mb-3">
								<div className="shrink-0 rounded-md bg-red-50 p-2.5 dark:bg-red-950/50">
									<FileText className="text-[#c8102e]" size={18} />
								</div>
								<div className="min-w-0">
									<h2 className="break-words text-xl font-semibold leading-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
										{resource.name}
									</h2>
									{resource.resource_types?.[0] && (
										<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{resource.resource_types[0].name}</p>
									)}
								</div>
							</div>

							{resource.description && (
								<p className="mb-4 break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300">
									{resource.description}
								</p>
							)}

							<div className="flex flex-wrap gap-2 mb-4">
								{resource.departments?.map((dept) => (
									<span
										key={dept.id}
										className="inline-flex max-w-full items-center break-words rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-[#c8102e] dark:bg-red-950/50"
									>
										{dept.name}
									</span>
								))}
								{resource.functions?.map((func) => (
									<span
										key={func.id}
										className="inline-flex max-w-full items-center break-words rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
									>
										{func.name}
									</span>
								))}
							</div>

							<div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
								<p className="text-sm text-slate-500 dark:text-slate-400">
									{resource.is_active ? 'Active resource' : 'Inactive resource'}
								</p>
								{resource.url ? (
									<a
										href={resource.url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex min-h-11 items-center gap-1 self-start text-sm font-medium text-[#c8102e] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] sm:min-h-0"
									>
										View Details
										<ArrowRight size={14} />
									</a>
								) : (
									<div className="flex flex-col items-end gap-1">
										<span className="text-xs text-slate-500 dark:text-slate-400">
											Resource link not listed
										</span>
										{resource.departments?.[0] && (
											<button
												type="button"
												onClick={() =>
													navigate(`/department/${resource.departments[0].slug}`)
												}
												className="inline-flex min-h-11 items-center gap-1 text-left text-sm font-medium text-[#c8102e] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] sm:min-h-0"
											>
												Browse {resource.departments[0].name}
												<ArrowRight size={14} />
											</button>
										)}
									</div>
								)}
							</div>
						</div>
							))}
						</div>

						{entityResources.length === 0 && (
							<div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:p-8">
								<FileQuestion size={22} className="mx-auto mb-2 text-slate-400" />
								<h2 className="font-semibold text-slate-800 dark:text-slate-100">
									No resources available for this {entityTypeLabel} yet
								</h2>
								<p className="mt-2 text-sm">
									Try another category or browse all available resources.
								</p>
								<div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
									<button
										type="button"
										onClick={() =>
											navigate(
												type === 'department'
													? '/department'
													: type === 'function'
														? '/functions'
														: '/resources',
											)
										}
										className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] sm:min-h-0"
									>
										<ArrowLeft size={14} />
										Browse {parentLabel.toLowerCase()}
									</button>
									<button
										type="button"
										onClick={() => navigate('/search')}
										className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] sm:min-h-0"
									>
										<Building2 size={15} />
										Search all resources
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
						<CircleAlert size={18} />
						Unable to load entity details.
					</div>
				)}
			</div>
		</div>
	);
}

export default EntityDetail;

import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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

				if (type === 'department') {
					data = await getDepartmentBySlugService(slug);
				} else if (type === 'function') {
					data = await getFunctionBySlugService(slug);
				} else if (type === 'resource-types' || type === 'resource-type') {
					data = await getResourceTypeBySlugService(slug);
				}

				if (!cancelled) {
					if (!data) {
						throw new Error('No matching entity found.');
					}
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
	}, [type, slug, location.state]);

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
		type === 'department' ? 'department' : type === 'function' ? 'function' : 'resource type';
	const parentLabel =
		type === 'department' ? 'Departments' : type === 'function' ? 'Functions' : 'Resource Types';

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<div className="max-w-6xl mx-auto px-6 py-6">
				<div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
					<span
						className="hover:text-[#c8102e] cursor-pointer"
						onClick={() => navigate('/')}
					>
						Home
					</span>
					<span className="mx-2">›</span>
					<span
						className="hover:text-[#c8102e] cursor-pointer"
						onClick={() => navigate(type === 'department' ? '/department' : type === 'function' ? '/functions' : '/resources')}
					>
						{parentLabel}
					</span>
					<span className="mx-2">›</span>
					<span className="text-slate-700 dark:text-slate-300 font-medium">{entityName}</span>
				</div>

				<h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
					{entityName}
				</h1>
				<p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
					{entityDescription}
				</p>

				<div className="mt-6 flex items-center gap-2 text-slate-600">
					<div className="bg-red-50 p-2 rounded-md">
						<FileText className="text-[#c8102e]" size={18} />
					</div>
					<p className="text-base font-medium">
						{loading
							? `Resources in this ${entityTypeLabel}`
							: `${entityResources.length} resource${entityResources.length === 1 ? '' : 's'} in this ${entityTypeLabel}`}
					</p>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-6 pb-12">
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
					<div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
						<CircleAlert size={18} />
						{error}
					</div>
				) : currentEntity ? (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{entityResources.map((resource) => (
						<div
							key={resource.id}
							className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
						>
							<div className="flex items-start gap-3 mb-3">
								<div className="bg-red-50 p-2.5 rounded-md">
									<FileText className="text-[#c8102e]" size={18} />
								</div>
								<div>
									<h2 className="text-2xl font-semibold text-slate-900 leading-tight">
										{resource.name}
									</h2>
									{resource.resource_types?.[0] && (
										<p className="text-sm text-slate-400 mt-1">{resource.resource_types[0].name}</p>
									)}
								</div>
							</div>

							{resource.description && (
								<p className="text-sm text-slate-600 leading-relaxed mb-4">
									{resource.description}
								</p>
							)}

							<div className="flex flex-wrap gap-2 mb-4">
								{resource.departments?.map((dept) => (
									<span
										key={dept.id}
										className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-[#c8102e]"
									>
										{dept.name}
									</span>
								))}
								{resource.functions?.map((func) => (
									<span
										key={func.id}
										className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
									>
										{func.name}
									</span>
								))}
							</div>

							<div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
								<p className="text-sm text-slate-500">
									{resource.is_active ? 'Active resource' : 'Inactive resource'}
								</p>
								{resource.url ? (
									<a
										href={resource.url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline"
									>
										View Details
										<ArrowRight size={14} />
									</a>
								) : (
									<div className="flex flex-col items-end gap-1">
										<span className="text-xs text-slate-400">
											Resource link not listed
										</span>
										{resource.departments?.[0] && (
											<button
												type="button"
												onClick={() =>
													navigate(`/department/${resource.departments[0].slug}`)
												}
												className="inline-flex items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline"
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
							<div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
								<FileQuestion size={22} className="mx-auto mb-2 text-slate-400" />
								<h2 className="font-semibold text-slate-800">
									No resources available for this {entityTypeLabel} yet
								</h2>
								<p className="mt-2 text-sm">
									Try another category or browse all available resources.
								</p>
								<div className="mt-4 flex flex-wrap justify-center gap-4">
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
										className="inline-flex items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline"
									>
										<ArrowLeft size={14} />
										Browse {parentLabel.toLowerCase()}
									</button>
									<button
										type="button"
										onClick={() => navigate('/search')}
										className="inline-flex items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline"
									>
										<Building2 size={15} />
										Search all resources
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
						<CircleAlert size={18} />
						Unable to load entity details.
					</div>
				)}
			</div>
		</div>
	);
}

export default EntityDetail;

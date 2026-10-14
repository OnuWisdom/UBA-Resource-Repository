import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
	ArrowLeft,
	ArrowRight,
	Building2,
	CircleAlert,
	FileText,
	LoaderCircle,
} from 'lucide-react';
import {
	getResourcesService,
	type ResourceSearchResult,
} from '../services/queryServices';

type ResourceRouteState = {
	resource?: ResourceSearchResult;
};

type LoadedResource = {
	slug: string;
	resource?: ResourceSearchResult;
	error?: string;
};

function ResourceDetail() {
	const { slug } = useParams();
	const location = useLocation();
	const routeResource = (location.state as ResourceRouteState | null)?.resource;
	const [loadedResource, setLoadedResource] = useState<LoadedResource | null>(null);

	useEffect(() => {
		if (!slug || routeResource?.slug === slug) return;
		let cancelled = false;

		const loadResource = async () => {
			try {
				const resources = await getResourcesService();
				const resource = resources.find((item) => item.slug === slug);
				if (!resource) throw new Error('This resource could not be found.');
				if (!cancelled) setLoadedResource({ slug, resource });
			} catch (error) {
				if (!cancelled) {
					setLoadedResource({
						slug,
						error:
							error instanceof Error
								? error.message
								: 'Unable to load this resource.',
					});
				}
			}
		};

		void loadResource();
		return () => {
			cancelled = true;
		};
	}, [slug, routeResource]);

	const resource =
		routeResource?.slug === slug
			? routeResource
			: slug && loadedResource?.slug === slug
				? loadedResource.resource
				: undefined;
	const error =
		slug && loadedResource?.slug === slug ? loadedResource.error : undefined;
	const loading = !resource && !error;

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
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
							to="/#frequently-used-resources"
							className="rounded-sm hover:text-[#c8102e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
						>
							Frequently Used Resources
						</Link>
						<span aria-hidden="true">›</span>
						<span
							aria-current="page"
							className="max-w-full break-words font-medium text-slate-700 dark:text-slate-300"
						>
							{resource?.name ?? 'Resource details'}
						</span>
					</nav>
					<h1 className="break-words text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
						{resource?.name ?? 'Resource details'}
					</h1>
					{resource && (
						<p className="mt-1 break-words text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
							{resource.description}
						</p>
					)}
				</div>
			</div>

			<main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
				<Link
					to="/#frequently-used-resources"
					className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#c8102e] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
				>
					<ArrowLeft size={16} />
					Back to frequently used resources
				</Link>

				{loading && (
					<div className="flex min-h-40 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400" role="status">
						<LoaderCircle size={18} className="animate-spin text-[#c8102e]" />
						Loading resource details...
					</div>
				)}

				{error && (
					<div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-900 sm:p-8">
						<CircleAlert size={24} className="mx-auto mb-3 text-[#c8102e]" />
						<h2 className="font-semibold text-slate-900 dark:text-slate-100">
							Resource details aren’t available
						</h2>
						<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
							{error} Try browsing resources or searching by name.
						</p>
						<div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
							<Link
								to="/resources"
								className="inline-flex min-h-11 items-center text-sm font-medium text-[#c8102e] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
							>
								Browse resource types
							</Link>
							<Link
								to="/search"
								className="inline-flex min-h-11 items-center text-sm font-medium text-[#c8102e] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
							>
								Search resources
							</Link>
						</div>
					</div>
				)}

				{resource && (
					<div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
						<section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
							<div className="mb-5 flex items-center gap-3">
								<div className="shrink-0 rounded-md bg-red-50 p-2.5 text-[#c8102e] dark:bg-red-950/50">
									<FileText size={20} />
								</div>
								<div className="min-w-0">
									<h2 className="font-semibold text-slate-900 dark:text-slate-100">
										About this resource
									</h2>
									<p className="break-words text-sm text-slate-500 dark:text-slate-400">
										{resource.resource_types?.map((type) => type.name).join(', ') ||
											'Resource'}
									</p>
								</div>
							</div>
							<p className="break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300">
								{resource.description || 'No description has been added yet.'}
							</p>
							<div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
								<p className="text-sm text-slate-500 dark:text-slate-400">
									Status:{' '}
									<span className="font-medium text-slate-700 dark:text-slate-200">
										{resource.is_active ? 'Active' : 'Inactive'}
									</span>
								</p>
							</div>
						</section>

						<aside className="min-w-0 space-y-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
							<div>
								<h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
									<Building2 size={17} className="text-[#c8102e]" />
									Departments
								</h2>
								{resource.departments?.length ? (
									<div className="flex flex-wrap gap-2">
										{resource.departments.map((department) => (
											<Link
												key={department.id}
												to={`/department/${department.slug}`}
												className="inline-flex min-h-11 max-w-full items-center break-words rounded-full bg-red-50 px-3 py-2 text-xs font-medium text-[#c8102e] hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:bg-red-950/50 dark:hover:bg-red-950 sm:min-h-0 sm:px-2.5 sm:py-1"
											>
												{department.name}
											</Link>
										))}
									</div>
								) : (
									<p className="text-sm text-slate-500 dark:text-slate-400">No department listed.</p>
								)}
							</div>

							<div>
								<h2 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
									Related functions
								</h2>
								{resource.functions?.length ? (
									<div className="flex flex-wrap gap-2">
										{resource.functions.map((func) => (
											<Link
												key={func.id}
												to={`/functions/${func.slug}`}
												className="inline-flex min-h-11 max-w-full items-center break-words rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:min-h-0 sm:px-2.5 sm:py-1"
											>
												{func.name}
											</Link>
										))}
									</div>
								) : (
									<p className="text-sm text-slate-500 dark:text-slate-400">No function listed.</p>
								)}
							</div>

							<div className="border-t border-slate-200 pt-4 dark:border-slate-700">
								{resource.url ? (
									<a
										href={resource.url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#c8102e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a80d26] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
									>
										Open resource <ArrowRight size={15} />
									</a>
								) : (
									<div>
										<p className="text-sm text-slate-500 dark:text-slate-400">
											A direct link hasn’t been added for this resource yet.
										</p>
										<Link
											to="/feedback"
											className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-[#c8102e] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
										>
											Report a missing or outdated link
										</Link>
									</div>
								)}
							</div>
						</aside>
					</div>
				)}
			</main>
		</div>
	);
}

export default ResourceDetail;

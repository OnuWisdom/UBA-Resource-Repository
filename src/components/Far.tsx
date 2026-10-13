import { useEffect, useState } from 'react';
import { CircleAlert, FileQuestion, LoaderCircle } from 'lucide-react';
import Card from './Card';
import { getResourcesService, type ResourceSearchResult } from '../services/queryServices';

const MAX_FEATURED_RESOURCES = 8;

function Far() {
	const [resources, setResources] = useState<ResourceSearchResult[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const loadResources = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await getResourcesService();
				if (!cancelled) {
					setResources(
						data
							.filter((resource) => resource.is_active)
							.slice(0, MAX_FEATURED_RESOURCES),
					);
				}
			} catch (loadError) {
				if (!cancelled) {
					setError(
						loadError instanceof Error
							? loadError.message
							: 'Unable to load frequently used resources.',
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void loadResources();
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<section
			id="frequently-used-resources"
			className="bg-slate-50 py-14 dark:bg-slate-950 sm:py-16"
		>
			<div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
				<div className="mb-7 flex flex-col justify-between gap-2 sm:mb-8 sm:flex-row sm:items-end">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c8102e]">
							A good place to start
						</p>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
							Featured resources
						</h2>
						<p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
							Explore active tools and services available across UBA.
						</p>
					</div>
				</div>
				{loading && (
					<div
						className="flex min-h-32 items-center justify-center gap-2 text-sm text-slate-500"
						role="status"
					>
						<LoaderCircle size={18} className="animate-spin text-[#c8102e]" />
						Loading resources...
					</div>
				)}

				{error && (
					<div
						className="flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
						role="alert"
					>
						<CircleAlert size={17} />
						{error}
					</div>
				)}

				{!loading && !error && resources.length === 0 && (
					<div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900">
						<FileQuestion size={24} className="mx-auto mb-2 text-slate-400" />
						<p className="font-medium">No active resources are available yet.</p>
						<p className="mt-1 text-sm">
							Resources will appear here when they are added to the repository.
						</p>
					</div>
				)}

				{!loading && !error && resources.length > 0 && (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{resources.map((resource) => (
							<Card key={resource.id} resource={resource} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}

export default Far;

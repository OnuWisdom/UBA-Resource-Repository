import { useEffect, useState } from 'react';
import { CircleAlert, Clock3, FileQuestion, LoaderCircle } from 'lucide-react';
import Card from './Card';
import {
	getRecentlyViewedResourcesService,
	type ResourceSearchResult,
} from '../services/queryServices';

function RecentlyViewed() {
	const [resources, setResources] = useState<ResourceSearchResult[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const loadRecentlyViewed = async () => {
			try {
				const data = await getRecentlyViewedResourcesService();
				if (!cancelled) setResources(data.slice(0, 10));
			} catch (loadError) {
				if (!cancelled) {
					setError(
						loadError instanceof Error
							? loadError.message
							: 'Unable to load recently viewed resources.',
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void loadRecentlyViewed();
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<section
			aria-labelledby="recently-viewed-heading"
			className="bg-white py-10 dark:bg-slate-900 sm:py-12"
		>
			<div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
				<div className="mb-6 flex items-start gap-3 sm:mb-7">
					<span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-[#c8102e] dark:bg-red-950/50 dark:text-red-300">
						<Clock3 size={19} aria-hidden="true" />
					</span>
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c8102e]">
							Your shortcuts
						</p>
						<h2
							id="recently-viewed-heading"
							className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl"
						>
							Pick up where you left off
						</h2>
						<p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
							Your recently viewed resources are kept here for quick access.
						</p>
					</div>
				</div>

				{loading && (
					<div
						className="flex min-h-24 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400"
						role="status"
					>
						<LoaderCircle size={18} className="animate-spin text-[#c8102e]" />
						Loading your recent resources...
					</div>
				)}

				{error && (
					<div
						className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
						role="alert"
					>
						<CircleAlert size={17} className="shrink-0" />
						{error}
					</div>
				)}

				{!loading && !error && resources.length === 0 && (
					<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950 sm:p-8">
						<FileQuestion
							size={24}
							className="mx-auto mb-2 text-slate-400"
							aria-hidden="true"
						/>
						<p className="font-medium text-slate-800 dark:text-slate-100">
							No recent resources yet
						</p>
						<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
							Resources you visit will appear here so they’re easy to find again.
						</p>
					</div>
				)}

				{!loading && !error && resources.length > 0 && (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{resources.map((resource) => (
							<Card key={resource.id} resource={resource} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}

export default RecentlyViewed;

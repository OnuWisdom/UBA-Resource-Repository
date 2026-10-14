import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { FileText, CircleAlert } from 'lucide-react';
import EntityCard from '../components/EntityCard';

export interface BrowseItem {
	id: number;
	name: string;
	slug: string;
	description: string;
	created_at: string;
	updated_at: string;
}

export interface EntityBrowsePageProps {
	pageTitle: string; // "Browse by Department"
	pageSubtitle: string; // "Explore digital resources organized by the department that owns them."
	breadcrumbLabel: string; // "Departments"
	fetchService: () => Promise<BrowseItem[]>;
	iconMap: Record<string, LucideIcon>;
	defaultIcon?: LucideIcon;
	routeBase: string; // "/department", "/functions", "/resource-types"
	linkLabel?: string; // "View resources" — same across all three in your screenshot
}

function EntityBrowsePage({
	pageTitle,
	pageSubtitle,
	breadcrumbLabel,
	fetchService,
	iconMap,
	defaultIcon = FileText,
	routeBase,
	linkLabel = 'View resources',
}: EntityBrowsePageProps) {
	const navigate = useNavigate();
	const [items, setItems] = useState<BrowseItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await fetchService();
				if (!cancelled) setItems(data);
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : 'Something went wrong');
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		load();
		return () => {
			cancelled = true;
		};
	}, [fetchService]);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
				<div className="mx-auto max-w-7xl px-4 py-5 sm:px-8 sm:py-7 lg:px-10">
					<nav
						aria-label="Breadcrumb"
						className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400 sm:mb-5"
					>
						<Link
							to="/"
							className="rounded-sm transition hover:text-[#c8102e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
						>
							Home
						</Link>
						<span aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</span>
						<span
							aria-current="page"
							className="max-w-full break-words font-medium text-slate-700 dark:text-slate-200"
						>
							{breadcrumbLabel}
						</span>
					</nav>
					<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c8102e]">
						Explore the directory
					</p>
					<h1 className="mt-2 break-words text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
						{pageTitle}
					</h1>
					<p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
						{pageSubtitle}
					</p>
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
				{loading && (
					<div
						className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
						role="status"
						aria-label={`Loading ${breadcrumbLabel.toLowerCase()}`}
					>
						{Array.from({ length: 6 }, (_, index) => (
							<div
								key={index}
								className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
							>
								<div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800" />
								<div className="mt-5 h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
								<div className="mt-3 h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
							</div>
						))}
					</div>
				)}

				{error && (
					<div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
						<CircleAlert size={16} />
						{error}
					</div>
				)}

				{!loading && !error && items.length === 0 && (
					<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-900 sm:p-10">
						<p className="font-medium text-slate-800 dark:text-slate-100">
							Nothing to show just yet
						</p>
						<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
							There are no {breadcrumbLabel.toLowerCase()} available to browse right now.
						</p>
					</div>
				)}

				{!loading && !error && items.length > 0 && (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
						{items.map((item) => (
							<EntityCard
								key={item.id}
								icon={iconMap[item.slug] || defaultIcon}
								title={item.name}
								description={item.description || undefined}
								linkLabel={linkLabel}
								onClick={() =>
									navigate(`/${routeBase.replace('/', '')}/${item.slug}`, {
										state: { entity: item },
									})
								}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default EntityBrowsePage;

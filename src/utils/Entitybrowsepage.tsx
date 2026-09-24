import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
		<div className="min-h-screen bg-slate-50">
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-6xl mx-auto px-6 py-6">
					<div className="text-sm text-slate-500 mb-3">
						<span
							className="hover:text-[#c8102e] cursor-pointer"
							onClick={() => navigate('/')}
						>
							Home
						</span>
						<span className="mx-2">›</span>
						<span className="text-slate-700 font-medium">{breadcrumbLabel}</span>
					</div>
					<h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
					<p className="text-slate-500 mt-1">{pageSubtitle}</p>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-6 py-8">
				{loading && <p className="text-sm text-slate-500">Loading...</p>}

				{error && (
					<div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
						<CircleAlert size={16} />
						{error}
					</div>
				)}

				{!loading && !error && items.length === 0 && (
					<p className="text-sm text-slate-500">Nothing to show yet.</p>
				)}

				{!loading && !error && items.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{items.map((item) => (
							<EntityCard
								key={item.id}
								icon={iconMap[item.slug] || defaultIcon}
								title={item.name}
								description={item.description || undefined}
								linkLabel={linkLabel}
								onClick={() => navigate(`${routeBase}/${item.slug}`)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default EntityBrowsePage;

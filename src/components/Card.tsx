import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FavoriteResource } from '../services/queryServices';
import FavoriteButton from './FavoriteButton';

interface CardProps {
	resource: FavoriteResource;
}

function Card({ resource }: CardProps) {
	const resourceType = resource.resource_types?.[0]?.name ?? 'Resource';
	const department = resource.departments?.[0]?.name ?? 'Shared resource';
	const functions = resource.functions ?? [];

	return (
		<article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c8102e]/50 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
			<div className="mb-3 flex items-start justify-between gap-3">
				<div className="rounded-md bg-red-50 p-2 text-[#c8102e] dark:bg-red-950/50">
					<FileText size={19} />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<h2 className="text-lg font-semibold leading-tight text-gray-900 dark:text-slate-100">
								{resource.name}
							</h2>
							<p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
								{resourceType}
							</p>
						</div>
						<FavoriteButton resource={resource} />
					</div>
				</div>
			</div>

			<p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
				{resource.description || 'No description has been added for this resource yet.'}
			</p>

			<div className="mb-4 flex flex-wrap items-center gap-2">
				<span className="text-xs font-medium text-[#c8102e]">{department}</span>
				{functions.slice(0, 2).map((func) => (
					<span
						key={func.id}
						className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
					>
						{func.name}
					</span>
				))}
			</div>

			<div className="mt-auto flex items-center justify-end border-t border-slate-200 pt-3 dark:border-slate-700">
				<Link
					to={`/resource/${resource.slug}`}
					state={{ resource }}
					className="inline-flex items-center gap-1 text-sm font-semibold text-[#c8102e] hover:underline"
				>
					View details <ArrowRight size={14} />
				</Link>
			</div>
		</article>
	);
}

export default Card;

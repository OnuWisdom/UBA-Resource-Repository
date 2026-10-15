import { Heart, LoaderCircle } from 'lucide-react';
import type { FavoriteResource } from '../services/queryServices';
import { useFavorites } from '../context/useFavorites';

function FavoriteButton({ resource }: { resource: FavoriteResource }) {
	const {
		isFavorite,
		isLoading,
		toggleFavorite,
		pendingSlugs,
		errorsBySlug,
	} = useFavorites();
	const favorited = isFavorite(resource.slug);
	const pending = isLoading || pendingSlugs.includes(resource.slug);
	const error = errorsBySlug[resource.slug];

	return (
		<div className="inline-flex flex-col items-end gap-1">
			<button
				type="button"
				onClick={() => void toggleFavorite(resource)}
				disabled={pending}
				aria-label={
					favorited
						? `Remove ${resource.name} from favorites`
						: `Add ${resource.name} to favorites`
				}
				aria-pressed={favorited}
				title={favorited ? 'Remove from favorites' : 'Add to favorites'}
				className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-[#c8102e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-300"
			>
				{pending ? (
					<LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
				) : (
					<Heart
						size={18}
						className={
							favorited ? 'fill-[#c8102e] text-[#c8102e]' : undefined
						}
						aria-hidden="true"
					/>
				)}
			</button>
			{error && (
				<span
					role="alert"
					className="max-w-40 text-right text-xs text-red-600 dark:text-red-400"
				>
					{error}
				</span>
			)}
		</div>
	);
}

export default FavoriteButton;

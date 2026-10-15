import { Heart, LoaderCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useFavorites } from '../context/useFavorites';

function Favorites() {
	const { favorites, isLoading, loadError, refreshFavorites } = useFavorites();

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
				<div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10">
					<nav
						aria-label="Breadcrumb"
						className="mb-5 text-sm text-slate-500 dark:text-slate-400"
					>
						<Link to="/" className="hover:text-[#c8102e]">
							Home
						</Link>
						<span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
						<span aria-current="page" className="font-medium text-slate-700 dark:text-slate-200">
							Favorites
						</span>
					</nav>
					<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c8102e]">
						Saved for later
					</p>
					<div className="mt-2 flex flex-wrap items-center gap-3">
						<Heart
							size={26}
							className="fill-red-100 text-[#c8102e] dark:fill-red-950"
							aria-hidden="true"
						/>
						<h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
							Your favorite resources
						</h1>
					</div>
					<p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
						Keep the resources you use most close at hand.
					</p>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
				{isLoading && (
					<div
						className="flex min-h-40 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400"
						role="status"
					>
						<LoaderCircle size={18} className="animate-spin text-[#c8102e]" />
						Loading your favorites...
					</div>
				)}

				{!isLoading && loadError && (
					<div
						className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
						role="alert"
					>
						<p>{loadError}</p>
						<button
							type="button"
							onClick={() => void refreshFavorites()}
							className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-semibold hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:border-red-800 dark:hover:bg-red-950"
						>
							<RefreshCw size={15} aria-hidden="true" />
							Try again
						</button>
					</div>
				)}

				{!isLoading && !loadError && favorites.length === 0 && (
					<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
						<span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-[#c8102e] dark:bg-red-950/50 dark:text-red-300">
							<Heart size={22} aria-hidden="true" />
						</span>
						<h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
							Your favorites will live here
						</h2>
						<p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
							When you find a resource you want to revisit, tap its heart to save
							it to this page.
						</p>
						<Link
							to="/resources"
							className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#c8102e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a80d26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2"
						>
							Explore resources
						</Link>
					</div>
				)}

				{!isLoading && !loadError && favorites.length > 0 && (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{favorites.map((resource) => (
							<Card key={resource.id} resource={resource} />
						))}
					</div>
				)}
			</main>
		</div>
	);
}

export default Favorites;

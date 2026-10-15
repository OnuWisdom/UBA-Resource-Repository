// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { searchResourceService } from '../services/queryServices';

// type SearchType = {
// 	id: string;
// 	name: string;
// 	slug: string;
// 	url: string;
// 	department: [];
// 	functions: [];
// 	resource_types: [];
// };

// function Search() {
// 	const [searchParams] = useSearchParams();
// 	const query = searchParams.get('q') || '';

// 	const [results, setResults] = useState<SearchType[]>([]);
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);

// 	useEffect(() => {
// 		if (!query) return;

// 		const getResults = async () => {
// 			try {
// 				setLoading(true);
// 				setError(null);

// 				const data = await searchResourceService(query);

// 				setResults(data);
// 			} catch (error) {
// 				setError(error instanceof Error ? error.message : 'Something went wrong');
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		getResults();
// 	}, [query]);

// 	return (
// 		<div>
// 			<h1>Search Results</h1>

// 			<p>Results for: {query}</p>

// 			{loading && <p>Searching...</p>}

// 			{error && <p>{error}</p>}

// 			{!loading && !error && results.length === 0 && <p>No resources found.</p>}

// 			{results.map((resource) => (
// 				<div key={resource.id}>
// 					<h2>{resource.name}</h2>
// 				</div>
// 			))}
// 		</div>
// 	);
// }

// export default Search;

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
	Search as SearchIcon,
	FileText,
	ArrowRight,
	CircleAlert,
	SearchX,
	Building2,
	BriefcaseBusiness,
} from 'lucide-react';
import { searchResourceService } from '../services/queryServices';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';

type ResourceRef = {
	id: number;
	name: string;
	slug: string;
};

type SearchType = {
	id: number;
	name: string;
	slug: string;
	description: string;
	url: string;
	departments: ResourceRef[];
	functions: ResourceRef[];
	resource_types: ResourceRef[];
	is_active: boolean;
	created_at?: string;
	updated_at?: string;
};

const suggestedSearches = ['leave', 'expense', 'password', 'training'];

function Search() {
	const [searchParams, setSearchParams] = useSearchParams();
	const query = searchParams.get('q') || '';
	const navigate = useNavigate();

	const [results, setResults] = useState<SearchType[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!query) return;

		let cancelled = false;
		const getResults = async () => {
			try {
				setLoading(true);
				setError(null);

				const data = await searchResourceService(query);
				if (!cancelled) setResults(data);
			} catch (error) {
				if (!cancelled) {
					setError(
						error instanceof Error ? error.message : 'Something went wrong',
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void getResults();
		return () => {
			cancelled = true;
		};
	}, [query]);

	const handleSearch = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const nextQuery = String(formData.get('q') ?? '').trim();
		if (nextQuery) {
			setSearchParams({ q: nextQuery });
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			{/* Top bar */}
			<div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
				<div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10">
					<div className="mb-5 text-sm text-slate-500 dark:text-slate-400">
						<span
							className="cursor-pointer transition hover:text-[#c8102e]"
							onClick={() => navigate('/')}
						>
							Home
						</span>
						<span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
						<span className="font-medium text-slate-700 dark:text-slate-200">Search</span>
					</div>
					<div className="mb-5">
						<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c8102e]">
							Find your next step
						</p>
						<h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
							Search resources
						</h1>
					</div>

					<form key={query} onSubmit={handleSearch} className="flex gap-2 sm:gap-3">
						<div className="relative min-w-0 flex-1">
							<SearchIcon
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								size={18}
							/>
							<input
								type="search"
								name="q"
								defaultValue={query}
								placeholder="What do you need help finding?"
								aria-label="Search resources"
								className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
							/>
						</div>
						<button
							type="submit"
							className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-[#c8102e] px-4 text-sm font-semibold text-white transition hover:bg-[#a80d26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
						>
							Search
							<ArrowRight size={16} aria-hidden="true" />
						</button>
					</form>

					{query && !loading && (
						<p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
							<span className="font-semibold text-slate-900 dark:text-slate-100">
								{results.length}
							</span>{' '}
							results for{' '}
							<span className="font-medium text-[#c8102e]">“{query}”</span>
						</p>
					)}
				</div>
			</div>

			{/* Results grid */}
			<div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
				{loading && query && (
					<div
						className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
						role="status"
						aria-label="Searching resources"
					>
						{Array.from({ length: 6 }, (_, index) => (
							<div
								key={index}
								className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
							>
								<div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
								<div className="mt-5 h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
								<div className="mt-3 h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
								<div className="mt-2 h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800" />
							</div>
						))}
					</div>
				)}

				{!loading && !error && !query && (
					<section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900 sm:p-10">
						<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c8102e]">
							Not sure where to start?
						</p>
						<h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
							Try a popular search
						</h2>
						<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
							Search by what you need to do, or explore the directory by team.
						</p>
						<div className="mt-5 flex flex-wrap gap-2">
							{suggestedSearches.map((suggestion) => (
								<button
									key={suggestion}
									type="button"
									onClick={() => {
										setSearchParams({ q: suggestion });
									}}
									className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-[#c8102e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-300"
								>
									{suggestion}
								</button>
							))}
						</div>
						<div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
							<Link
								to="/department"
								className="inline-flex items-center gap-2 text-sm font-semibold text-[#c8102e] hover:underline"
							>
								<Building2 size={16} /> Browse departments
							</Link>
							<Link
								to="/functions"
								className="inline-flex items-center gap-2 text-sm font-semibold text-[#c8102e] hover:underline"
							>
								<BriefcaseBusiness size={16} /> Browse functions
							</Link>
						</div>
					</section>
				)}

				{query && error && (
					<div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
						<CircleAlert size={16} />
						{error}
					</div>
				)}

				{!loading && !error && query && results.length === 0 && (
					<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
						<SearchX size={28} className="mx-auto mb-3 text-slate-400" />
						<h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
							No resources found for “{query}”
						</h2>
						<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
							Try a shorter phrase, a different keyword, or browse resources by category.
						</p>
						<div className="mt-4 flex flex-wrap justify-center gap-2">
							{suggestedSearches.map((suggestion) => (
								<button
									key={suggestion}
									type="button"
									onClick={() => {
										setSearchParams({ q: suggestion });
									}}
									className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:border-[#c8102e]/40 hover:text-[#c8102e]"
								>
									{suggestion}
								</button>
							))}
						</div>
						<div className="mt-5 flex flex-wrap justify-center gap-3">
							<Link
								to="/department"
								className="inline-flex items-center gap-2 text-sm font-medium text-[#c8102e] hover:underline"
							>
								<Building2 size={16} /> Browse departments
							</Link>
							<Link
								to="/functions"
								className="inline-flex items-center gap-2 text-sm font-medium text-[#c8102e] hover:underline"
							>
								<BriefcaseBusiness size={16} /> Browse functions
							</Link>
						</div>
					</div>
				)}

				{!loading && !error && results.length > 0 && (
					<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
						{results.map((resource) => (
							<div
								key={resource.id}
								className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-slate-900/[0.07] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900 dark:hover:shadow-black/20 sm:p-6"
							>
								<div className="mb-3 flex items-start gap-3">
									<div className="rounded-xl bg-red-50 p-2.5 text-[#c8102e] dark:bg-red-950/50 dark:text-red-300">
										<FileText className="text-[#c8102e]" size={18} />
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-2">
											<div className="min-w-0">
												<h3 className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-100">
											{resource.name}
												</h3>
												{resource.resource_types?.[0] && (
													<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
														{resource.resource_types[0].name}
													</p>
												)}
											</div>
											<FavoriteButton resource={resource} />
										</div>
									</div>
								</div>

								{resource.description && (
									<p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
										{resource.description}
									</p>
								)}

								{(resource.departments?.length > 0 ||
									resource.functions?.length > 0) && (
									<div className="mb-4 flex flex-wrap gap-2">
										{resource.departments?.map((dept) => (
											<span
												key={dept.id}
												className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-[#c8102e] dark:bg-red-950/50 dark:text-red-300"
											>
												{dept.name}
											</span>
										))}
										{resource.functions?.map((fn) => (
											<span
												key={fn.id}
												className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
											>
												{fn.name}
											</span>
										))}
									</div>
								)}

								<div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
									<span className="text-xs text-slate-400 dark:text-slate-500">
										{resource.url ? 'Resource details' : 'Link not listed'}
									</span>
									<Link
										to={`/resource/${resource.slug}`}
										state={{ resource }}
										className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c8102e] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e]"
									>
										View details
										<ArrowRight size={15} />
									</Link>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default Search;

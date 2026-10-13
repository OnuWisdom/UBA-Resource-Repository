import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';

const popularSearches = [
	'Leave',
	'Allowance',
	'Password reset',
	'System access',
	'Learning',
];

function Hero() {
	const [search, setSearch] = useState('');
	const navigate = useNavigate();

	const openSearch = (query: string) => {
		const trimmedQuery = query.trim();
		if (!trimmedQuery) return;
		navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
	};

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		openSearch(search);
	};

	return (
		<section className="relative isolate overflow-hidden bg-[#842018] text-white dark:bg-[#5c1610]">
			<div
				className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full border border-white/10"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute -right-8 -top-20 h-64 w-64 rounded-full border border-white/10"
				aria-hidden="true"
			/>

			<div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 py-14 text-center sm:px-8 sm:py-16 lg:py-20">
				<p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 sm:text-sm">
					UBA Digital Resource Repository
				</p>
				<h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem]">
					Find the right resource.
					<span className="mt-1 block text-white/80">Get back to work.</span>
				</h1>
				<p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
					Search UBA’s internal platforms, applications, services, and guides—or
					browse by department and business function.
				</p>

				<form
					onSubmit={handleSearch}
					role="search"
					className="mt-8 flex w-full max-w-3xl items-center gap-2 rounded-xl bg-white p-2 shadow-xl shadow-black/15 ring-1 ring-black/5"
				>
					<SearchIcon
						size={21}
						className="ml-2 shrink-0 text-slate-400"
						aria-hidden="true"
					/>
					<input
						type="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="What resource are you looking for?"
						aria-label="Search internal resources"
						className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:h-12 sm:text-base"
					/>
					<button
						type="submit"
						disabled={!search.trim()}
						className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[#c8102e] px-4 text-sm font-semibold text-white transition hover:bg-[#a80d26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:px-6 sm:text-base"
					>
						Search
						<ArrowRight size={16} aria-hidden="true" />
					</button>
				</form>

				<div className="mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-2">
					<span className="mr-1 text-sm font-medium text-white/75">
						Popular searches
					</span>
					{popularSearches.map((term) => (
						<button
							key={term}
							type="button"
							onClick={() => openSearch(term)}
							className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/50 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-sm"
						>
							{term}
						</button>
					))}
				</div>
			</div>
		</section>
	);
}

export default Hero;

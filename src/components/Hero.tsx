import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search as SearchIcon, Sparkles } from 'lucide-react';

const popularSearches = ['Leave', 'Expenses', 'Password reset', 'System access'];

function Hero() {
	const [search, setSearch] = useState('');
	const navigate = useNavigate();

	const openSearch = (query: string) => {
		const trimmedQuery = query.trim();
		if (trimmedQuery) navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
	};

	const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		openSearch(search);
	};

	return (
		<section className="relative isolate overflow-hidden bg-[#761b20] text-white dark:bg-[#431619]">
			<div
				className="pointer-events-none absolute inset-0 opacity-30"
				aria-hidden="true"
				style={{
					backgroundImage:
						' radial-gradient(circle at 76% 22%, rgba(255,255,255,.18), transparent 24rem), radial-gradient(circle at 92% 100%, rgba(200,16,46,.55), transparent 28rem)',
				}}
			/>
			<div
				className="pointer-events-none absolute -right-28 -top-44 h-[30rem] w-[30rem] rounded-full border border-white/[0.08] sm:-right-16"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute -right-12 -top-28 h-[22rem] w-[22rem] rounded-full border border-white/[0.08]"
				aria-hidden="true"
			/>

			<div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 lg:px-10 lg:py-20">
				<div className="max-w-3xl">
					<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90">
						<Sparkles size={14} aria-hidden="true" />
						UBA DIGITAL RESOURCE HUB
					</div>
					<h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.65rem]">
						Find what you need.
						<span className="mt-1 block text-white/70">Get on with your day.</span>
					</h1>
					<p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
						One welcoming place to discover UBA’s tools, services, guides, and
						workplace resources.
					</p>

					<form
						onSubmit={handleSearch}
						role="search"
						className="mt-8 flex w-full max-w-3xl items-center gap-2 rounded-xl bg-white p-2 shadow-2xl shadow-black/20 ring-1 ring-black/5"
					>
						<SearchIcon
							size={21}
							className="ml-2 shrink-0 text-slate-400"
							aria-hidden="true"
						/>
						<input
							type="search"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Try “leave”, “expenses”, or “system access”"
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

					<div className="mt-5 flex flex-wrap items-center gap-2">
						<span className="mr-1 text-xs font-medium text-white/65">
							Popular:
						</span>
						{popularSearches.map((term) => (
							<button
								key={term}
								type="button"
								onClick={() => openSearch(term)}
								className="rounded-full border border-white/20 bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-white/90 transition hover:border-white/50 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
							>
								{term}
							</button>
						))}
					</div>
				</div>

				<div className="hidden lg:block" aria-hidden="true">
					<div className="relative mx-auto aspect-square max-w-[17rem]">
						<div className="absolute inset-0 rounded-[2.5rem] border border-white/10 bg-white/[0.04] rotate-6" />
						<div className="absolute inset-4 rounded-[2rem] border border-white/10 bg-white/[0.06] -rotate-3" />
						<div className="absolute inset-8 flex flex-col justify-between rounded-[1.5rem] border border-white/15 bg-white/[0.09] p-6 shadow-2xl backdrop-blur-sm">
							<div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#a41424] shadow-lg">
								<SearchIcon size={23} />
							</div>
							<div>
								<p className="text-sm font-medium text-white/65">Everything you need</p>
								<p className="mt-1 text-2xl font-semibold leading-tight">
									All in one
									<br />
									place.
								</p>
							</div>
							<div className="flex gap-1.5">
								<span className="h-1.5 w-10 rounded-full bg-white/80" />
								<span className="h-1.5 w-5 rounded-full bg-white/30" />
								<span className="h-1.5 w-5 rounded-full bg-white/30" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
		</section>
	);
}

export default Hero;

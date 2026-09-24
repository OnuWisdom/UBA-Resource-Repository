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
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
	Search as SearchIcon,
	FileText,
	ArrowRight,
	CircleAlert,
} from 'lucide-react';
import { searchResourceService } from '../services/queryServices';

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
	created_at: string;
	updated_at: string;
};

function Search() {
	const [searchParams, setSearchParams] = useSearchParams();
	const query = searchParams.get('q') || '';
	const navigate = useNavigate();

	const [inputValue, setInputValue] = useState(query);
	const [results, setResults] = useState<SearchType[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// setInputValue(query);

		if (!query) return;

		const getResults = async () => {
			try {
				setLoading(true);
				setError(null);

				const data = await searchResourceService(query);

				setResults(data);
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Something went wrong');
			} finally {
				setLoading(false);
			}
		};

		getResults();
	}, [query]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setSearchParams({ q: inputValue });
	};

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Top bar */}
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-6xl mx-auto px-6 py-5">
					<div className="text-sm text-slate-500 mb-4">
						<span
							className="hover:text-[#c8102e] cursor-pointer"
							onClick={() => navigate('/')}
						>
							Home
						</span>
						<span className="mx-2">/</span>
						<span className="text-slate-700 font-medium">Search</span>
					</div>

					<form onSubmit={handleSearch} className="flex gap-3">
						<div className="flex-1 relative">
							<SearchIcon
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								size={18}
							/>
							<input
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder="Search resources..."
								className="w-full h-11 border border-slate-300 rounded-md pl-10 pr-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#c8102e]/40 focus:border-[#c8102e] transition-colors"
							/>
						</div>
						<button
							type="submit"
							className="h-11 px-6 bg-[#c8102e] hover:bg-[#a80d26] text-white text-sm font-medium rounded-md transition-colors"
						>
							Search
						</button>
					</form>

					{query && !loading && (
						<p className="text-sm text-slate-600 mt-4">
							<span className="font-semibold text-slate-900">{results.length}</span>{' '}
							results for <span className="text-[#c8102e] font-medium">"{query}"</span>
						</p>
					)}
				</div>
			</div>

			{/* Results grid */}
			<div className="max-w-6xl mx-auto px-6 py-8">
				{loading && <p className="text-sm text-slate-500">Searching...</p>}

				{error && (
					<div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
						<CircleAlert size={16} />
						{error}
					</div>
				)}

				{!loading && !error && query && results.length === 0 && (
					<p className="text-sm text-slate-500">No resources found for "{query}".</p>
				)}

				{!loading && !error && results.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{results.map((resource) => (
							<div
								key={resource.id}
								className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
							>
								<div className="flex items-start gap-3 mb-3">
									<div className="bg-red-50 p-2 rounded-md">
										<FileText className="text-[#c8102e]" size={18} />
									</div>
									<div>
										<h3 className="font-semibold text-slate-900 text-base leading-tight">
											{resource.name}
										</h3>
										{resource.resource_types?.[0] && (
											<p className="text-xs text-slate-400 mt-0.5">
												{resource.resource_types[0].name}
											</p>
										)}
									</div>
								</div>

								{resource.description && (
									<p className="text-sm text-slate-600 leading-relaxed mb-4">
										{resource.description}
									</p>
								)}

								{(resource.departments?.length > 0 ||
									resource.functions?.length > 0) && (
									<div className="flex flex-wrap gap-2 mb-4">
										{resource.departments?.map((dept) => (
											<span
												key={dept.id}
												className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-[#c8102e]"
											>
												{dept.name}
											</span>
										))}
										{resource.functions?.map((fn) => (
											<span
												key={fn.id}
												className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600"
											>
												{fn.name}
											</span>
										))}
									</div>
								)}

								<div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-end">
									{resource.url ? (
										<a
											href={resource.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline"
										>
											View Details
											<ArrowRight size={14} />
										</a>
									) : (
										<span className="flex items-center gap-1 text-sm font-medium text-slate-300 cursor-not-allowed">
											No link available
										</span>
									)}
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

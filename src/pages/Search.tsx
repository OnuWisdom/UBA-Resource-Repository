import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchResourceService } from '../services/queryServices';

type SearchType = {
	id: string;
	name: string;
	slug: string;
	url: string;
	department: [];
	functions: [];
	resource_types: [];
};

function Search() {
	const [searchParams] = useSearchParams();
	const query = searchParams.get('q') || '';

	const [results, setResults] = useState<SearchType[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
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

	return (
		<div>
			<h1>Search Results</h1>

			<p>Results for: {query}</p>

			{loading && <p>Searching...</p>}

			{error && <p>{error}</p>}

			{!loading && !error && results.length === 0 && <p>No resources found.</p>}

			{results.map((resource) => (
				<div key={resource.id}>
					<h2>{resource.name}</h2>
				</div>
			))}
		</div>
	);
}

export default Search;

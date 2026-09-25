import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
	const [search, setSearch] = useState('');

	const navigate = useNavigate();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();

		if (!search.trim()) return;

		navigate(`/search?q=${encodeURIComponent(search.trim())}`);
	};

	return (
		<div className="flex flex-col items-center justify-center gap-6 text-center py-20 px-4 bg-[#842018] dark:bg-[#5c1610] text-white">
			<h1 className="font-bold text-6xl w-3xl">
				Find the platform, application and resources you need to navigate UBA.
			</h1>

			<h4 className="text-xl w-3xl my-4">
				Search across all internal digital resources - or browse by department,
				function or resource type
			</h4>

			<form onSubmit={handleSearch} className="relative w-3xl">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search platforms, applications and services..."
					className="w-full bg-white dark:bg-slate-100 text-black pl-4 pr-28 py-3 rounded-md focus:outline-none focus:ring focus:border-blue-300 placeholder:text-gray-400 text-lg"
				/>
				<button className="search-button bg-[#d70900] dark:bg-[#c8102e] text-xl text-white font-bold px-6 py-2 rounded-2xl hover:bg-[#a80c26] absolute right-2 top-1/2 -translate-y-1/2">
					Search
				</button>
			</form>

			<div className="popular">
				<p>
					{' '}
					<span>Popular:</span> Leave, allowance, password change, access,
					learning... e.t.c
				</p>
			</div>
		</div>
	);
}

export default Hero;

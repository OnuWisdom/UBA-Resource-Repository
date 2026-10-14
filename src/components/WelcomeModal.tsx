import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	ArrowRight,
	Clock3,
	Search,
	Smile,
	Sparkles,
	X,
} from 'lucide-react';

const moodOptions = [
	{ label: 'Ready to go', icon: Smile },
	{ label: 'A little busy', icon: Clock3 },
	{ label: 'Need a hand', icon: Sparkles },
];

function WelcomeModal() {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(
		() => sessionStorage.getItem('welcome_modal_dismissed') !== 'true',
	);
	const [selectedMood, setSelectedMood] = useState<string | null>(null);
	const [resourceQuery, setResourceQuery] = useState('');
	const resourceInputRef = useRef<HTMLInputElement>(null);
	const displayName = sessionStorage.getItem('display_name');

	const closeModal = useCallback(() => {
		sessionStorage.setItem('welcome_modal_dismissed', 'true');
		setIsOpen(false);
	}, []);

	useEffect(() => {
		if (!isOpen) return;

		resourceInputRef.current?.focus();
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeModal();
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [closeModal, isOpen]);

	const browseResources = () => {
		closeModal();
		navigate('/resources');
	};

	const searchResources = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const query = resourceQuery.trim();
		if (!query) return;
		closeModal();
		navigate(`/search?q=${encodeURIComponent(query)}`);
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) closeModal();
			}}
		>
			<section
				role="dialog"
				aria-modal="true"
				aria-labelledby="welcome-title"
				aria-describedby="welcome-description"
				className="relative my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
			>
				<div className="h-2 bg-[#c8102e]" />
				<button
					type="button"
					onClick={closeModal}
					aria-label="Close welcome dialog"
					className="absolute right-4 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:hover:bg-slate-800 dark:hover:text-slate-200"
				>
					<X size={19} />
				</button>

				<div className="p-4 sm:p-8">
					<p className="text-sm font-semibold text-[#c8102e]">
						Your UBA resource hub
					</p>
					<h1
						id="welcome-title"
						className="mt-2 pr-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl"
					>
						{displayName ? `Welcome, ${displayName}!` : 'Welcome!'}
					</h1>
					<p
						id="welcome-description"
						className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
					>
						Find the tools, services, and information you need to make your day
						easier.
					</p>

					<div className="mt-5 sm:mt-7">
						<h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
							How are you feeling today?
						</h2>
						<div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
							{moodOptions.map(({ label, icon: Icon }) => (
								<button
									key={label}
									type="button"
									aria-pressed={selectedMood === label}
									onClick={() => setSelectedMood(label)}
									className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] ${
										selectedMood === label
											? 'border-[#c8102e] bg-red-50 text-[#c8102e] dark:bg-red-950/40'
											: 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
									}`}
								>
									<Icon size={17} aria-hidden="true" />
									{label}
								</button>
							))}
						</div>
					</div>

					<div className="mt-5 sm:mt-7">
						<h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
							What resource will you be browsing today?
						</h2>
						<form onSubmit={searchResources} className="mt-3 flex gap-2">
							<div className="relative min-w-0 flex-1">
								<Search
									size={18}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
									aria-hidden="true"
								/>
								<input
									ref={resourceInputRef}
									type="search"
									value={resourceQuery}
									onChange={(event) => setResourceQuery(event.target.value)}
									placeholder="Try leave, expenses, or system access"
									aria-label="What resource are you looking for?"
									className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/25 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
								/>
							</div>
							<button
								type="submit"
								disabled={!resourceQuery.trim()}
								className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-[#c8102e] px-4 text-sm font-semibold text-white transition hover:bg-[#a80d26] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Find
								<ArrowRight size={16} aria-hidden="true" />
							</button>
						</form>
					</div>

					<div className="mt-5 flex flex-col-reverse items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700 sm:mt-6 sm:flex-row sm:pt-5">
						<button
							type="button"
							onClick={closeModal}
							className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
						>
							Maybe later
						</button>
						<button
							type="button"
							onClick={browseResources}
							className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#c8102e] px-4 py-2.5 text-sm font-semibold text-[#c8102e] transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:hover:bg-red-950/40 sm:w-auto"
						>
							Browse all resources
							<ArrowRight size={16} aria-hidden="true" />
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}

export default WelcomeModal;

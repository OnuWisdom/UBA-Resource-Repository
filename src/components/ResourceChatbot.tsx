import { useEffect, useRef, useState } from 'react';
import {
	ArrowRight,
	Bot,
	LoaderCircle,
	MessageCircle,
	Send,
	X,
} from 'lucide-react';
import {
	searchResourceService,
	type ResourceSearchResult,
} from '../services/queryServices';

type ChatMessage = {
	id: number;
	role: 'user' | 'assistant';
	text: string;
	resources?: ResourceSearchResult[];
};

const stopWords = new Set([
	'a',
	'an',
	'and',
	'are',
	'can',
	'do',
	'find',
	'for',
	'get',
	'help',
	'i',
	'me',
	'my',
	'need',
	'of',
	'on',
	'please',
	'show',
	'the',
	'to',
	'where',
	'with',
]);

function getSearchTerms(question: string) {
	return [
		...new Set(
			question
				.toLowerCase()
				.replace(/[^\p{L}\p{N}\s-]/gu, ' ')
				.split(/\s+/)
				.map((term) => term.trim())
				.filter((term) => term.length > 2 && !stopWords.has(term)),
		),
	].slice(0, 4);
}

function rankResources(resources: ResourceSearchResult[], terms: string[]) {
	const uniqueResources = new Map<number, ResourceSearchResult>();
	for (const resource of resources) {
		uniqueResources.set(resource.id, resource);
	}

	return [...uniqueResources.values()]
		.map((resource) => {
			const searchableText = [
				resource.name,
				resource.description,
				...(resource.departments ?? []).map((item) => item.name),
				...(resource.functions ?? []).map((item) => item.name),
				...(resource.resource_types ?? []).map((item) => item.name),
			]
				.join(' ')
				.toLowerCase();
			const score = terms.reduce(
				(total, term) => total + (searchableText.includes(term) ? 1 : 0),
				0,
			);
			return { resource, score };
		})
		.filter(({ score }) => score > 0)
		.sort(
			(a, b) =>
				b.score - a.score || a.resource.name.localeCompare(b.resource.name),
		)
		.slice(0, 5)
		.map(({ resource }) => resource);
}

function ResourceChatbot() {
	const [isOpen, setIsOpen] = useState(false);
	const [question, setQuestion] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: 0,
			role: 'assistant',
			text:
				'Hi! Tell me what you need help with, and I’ll look for matching resources.',
		},
	]);
	const nextMessageId = useRef(1);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, isSearching]);

	const sendQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const submittedQuestion = question.trim();
		if (!submittedQuestion || isSearching) return;

		const userMessageId = nextMessageId.current++;
		const assistantMessageId = nextMessageId.current++;
		const terms = getSearchTerms(submittedQuestion);

		setQuestion('');
		setIsSearching(true);
		setMessages((current) => [
			...current,
			{ id: userMessageId, role: 'user', text: submittedQuestion },
		]);

		try {
			if (terms.length === 0) {
				setMessages((current) => [
					...current,
					{
						id: assistantMessageId,
						role: 'assistant',
						text:
							'Try including a resource name or a topic such as leave, expenses, passwords, or training.',
					},
				]);
				return;
			}

			const searches = await Promise.allSettled(
				terms.map((term) => searchResourceService(term)),
			);
			const successfulSearches = searches.filter(
				(result): result is PromiseFulfilledResult<ResourceSearchResult[]> =>
					result.status === 'fulfilled',
			);

			if (successfulSearches.length === 0) {
				throw new Error(
					'I could not search resources right now. Please try again shortly.',
				);
			}

			const results = rankResources(
				successfulSearches.flatMap((result) => result.value),
				terms,
			);

			setMessages((current) => [
				...current,
				{
					id: assistantMessageId,
					role: 'assistant',
					text: results.length
						? `I found ${results.length} resource${results.length === 1 ? '' : 's'} that may help:`
						: 'I couldn’t find a matching resource. Try different keywords or browse by department or function.',
					resources: results,
				},
			]);
		} catch (error) {
			setMessages((current) => [
				...current,
				{
					id: assistantMessageId,
					role: 'assistant',
					text:
						error instanceof Error
							? error.message
							: 'Something went wrong while searching resources.',
				},
			]);
		} finally {
			setIsSearching(false);
		}
	};

	return (
		<div className="fixed bottom-5 right-5 z-50">
			{isOpen && (
				<section
					className="mb-3 flex h-[min(70vh,36rem)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
					aria-label="Resource assistant"
				>
					<div className="flex items-center justify-between bg-[#c8102e] px-4 py-3 text-white">
						<div className="flex items-center gap-2">
							<Bot size={20} aria-hidden="true" />
							<div>
								<h2 className="text-sm font-semibold">Resource Assistant</h2>
								{/* <p className="text-xs text-white/80">Keyword-based resource finder</p> */}
							</div>
						</div>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="rounded p-1 hover:bg-white/15"
							aria-label="Close resource assistant"
						>
							<X size={18} />
						</button>
					</div>

					<div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 dark:bg-slate-950">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
										message.role === 'user'
											? 'bg-[#c8102e] text-white'
											: 'bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200'
									}`}
								>
									<p>{message.text}</p>
									{message.resources?.map((resource) => (
										<div
											key={resource.id}
											className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
										>
											<h3 className="font-semibold">{resource.name}</h3>
											{resource.description && (
												<p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
													{resource.description}
												</p>
											)}
											<div className="mt-2 flex flex-wrap gap-1">
												{resource.departments?.map((department) => (
													<span
														key={department.id}
														className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] text-[#c8102e] dark:bg-red-950/50"
													>
														{department.name}
													</span>
												))}
												{resource.functions?.map((func) => (
													<span
														key={func.id}
														className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-700 dark:text-slate-300"
													>
														{func.name}
													</span>
												))}
											</div>
											{resource.url ? (
												<a
													href={resource.url}
													target="_blank"
													rel="noopener noreferrer"
													className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#c8102e] hover:underline"
												>
													Open resource <ArrowRight size={12} />
												</a>
											) : (
												<p className="mt-2 text-xs text-slate-400">No link available</p>
											)}
										</div>
									))}
								</div>
							</div>
						))}
						{isSearching && (
							<div
								className="flex items-center gap-2 text-sm text-slate-500"
								role="status"
							>
								<LoaderCircle size={16} className="animate-spin text-[#c8102e]" />
								Searching resources...
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					<form
						onSubmit={sendQuestion}
						className="flex gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
					>
						<input
							type="text"
							value={question}
							onChange={(event) => setQuestion(event.target.value)}
							placeholder="What resource do you need?"
							aria-label="Ask about a resource"
							className="h-10 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
						/>
						<button
							type="submit"
							disabled={!question.trim() || isSearching}
							className="flex h-10 w-10 items-center justify-center rounded-md bg-[#c8102e] text-white transition hover:bg-[#a80d26] disabled:cursor-not-allowed disabled:opacity-50"
							aria-label="Send question"
						>
							<Send size={16} />
						</button>
					</form>
				</section>
			)}

			<button
				type="button"
				onClick={() => setIsOpen((open) => !open)}
				className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#c8102e] text-white shadow-lg transition hover:bg-[#a80d26] focus:outline-none focus:ring-4 focus:ring-[#c8102e]/30"
				aria-label={isOpen ? 'Close resource assistant' : 'Open resource assistant'}
				aria-expanded={isOpen}
			>
				{isOpen ? <X size={22} /> : <MessageCircle size={24} />}
			</button>
		</div>
	);
}

export default ResourceChatbot;

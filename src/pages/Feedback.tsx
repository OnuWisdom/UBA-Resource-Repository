import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	ArrowLeft,
	ArrowRight,
	BadgeCheck,
	BookPlus,
	CircleAlert,
	Clock3,
	FilePenLine,
	Link as LinkIcon,
	LoaderCircle,
	MessageSquareWarning,
	Trash2,
} from 'lucide-react';
import {
	getDepartmentService,
	getFunctionService,
	getResourceService,
} from '../services/queryServices';

type FeedbackKind = 'suggest' | 'outdated' | 'inactive' | 'updated';

type FeedbackOption = {
	id: number;
	name: string;
	slug: string;
};

type FeedbackDraft = {
	resourceName: string;
	description: string;
	resourceUrl: string;
	resourceTypeId: string;
	departmentIds: number[];
	functionIds: number[];
	details: string;
	updatedUrl: string;
	reporterName: string;
	reporterEmail: string;
};

const emptyDraft: FeedbackDraft = {
	resourceName: '',
	description: '',
	resourceUrl: '',
	resourceTypeId: '',
	departmentIds: [],
	functionIds: [],
	details: '',
	updatedUrl: '',
	reporterName: '',
	reporterEmail: '',
};

const feedbackKinds: Array<{
	id: FeedbackKind;
	title: string;
	description: string;
	icon: typeof BookPlus;
}> = [
	{
		id: 'suggest',
		title: 'Suggest a new resource',
		description: 'Recommend a useful tool, guide, portal, or document to add.',
		icon: BookPlus,
	},
	{
		id: 'outdated',
		title: 'Report outdated information',
		description:
			'Tell us when a resource’s details or instructions are out of date.',
		icon: Clock3,
	},
	{
		id: 'inactive',
		title: 'Report a resource no longer in use',
		description:
			'Let us know when a resource has been retired or is unavailable.',
		icon: Trash2,
	},
	{
		id: 'updated',
		title: 'Report an updated resource',
		description: 'Share a replacement link or details that have changed.',
		icon: FilePenLine,
	},
];

const inputClassName =
	'w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

function Feedback() {
	const [kind, setKind] = useState<FeedbackKind | null>(null);
	const [draft, setDraft] = useState<FeedbackDraft>(emptyDraft);
	const [submitted, setSubmitted] = useState(false);
	const [departments, setDepartments] = useState<FeedbackOption[]>([]);
	const [functions, setFunctions] = useState<FeedbackOption[]>([]);
	const [resourceTypes, setResourceTypes] = useState<FeedbackOption[]>([]);
	const [loadingOptions, setLoadingOptions] = useState(true);
	const [optionsError, setOptionsError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const loadOptions = async () => {
			try {
				setLoadingOptions(true);
				setOptionsError(null);
				const [departmentData, functionData, resourceTypeData] = await Promise.all([
					getDepartmentService(),
					getFunctionService(),
					getResourceService(),
				]);
				if (!cancelled) {
					setDepartments(departmentData);
					setFunctions(functionData);
					setResourceTypes(resourceTypeData);
				}
			} catch (error) {
				if (!cancelled) {
					setOptionsError(
						error instanceof Error
							? error.message
							: 'Unable to load resource categories.',
					);
				}
			} finally {
				if (!cancelled) setLoadingOptions(false);
			}
		};

		void loadOptions();
		return () => {
			cancelled = true;
		};
	}, []);

	const toggleOption = (field: 'departmentIds' | 'functionIds', id: number) => {
		setDraft((current) => ({
			...current,
			[field]: current[field].includes(id)
				? current[field].filter((selectedId) => selectedId !== id)
				: [...current[field], id],
		}));
	};

	const startRequest = (selectedKind: FeedbackKind) => {
		setDraft(emptyDraft);
		setSubmitted(false);
		setKind(selectedKind);
	};

	const submitForReview = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
	};

	const selectedKind = feedbackKinds.find((item) => item.id === kind);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
				<div className="mx-auto max-w-6xl px-6 py-6">
					<div className="mb-3 text-sm text-slate-500 dark:text-slate-400">
						<Link to="/" className="hover:text-[#c8102e]">
							Home
						</Link>
						<span className="mx-2">›</span>
						<span className="font-medium text-slate-700 dark:text-slate-300">
							Feedback &amp; resource requests
						</span>
					</div>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
						Feedback &amp; resource requests
					</h1>
					<p className="mt-1 text-slate-500 dark:text-slate-400">
						Help keep the resource repository useful and up to date.
					</p>
				</div>
			</div>

			<main className="mx-auto max-w-6xl px-6 py-8">
				<div className="mb-6 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
					<MessageSquareWarning size={18} className="mt-0.5 shrink-0" />
					<p>Help Other Employees get updated resources.</p>
				</div>

				{optionsError && (
					<div
						className="mb-6 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
						role="alert"
					>
						<CircleAlert size={16} />
						{optionsError} You can still complete the form, but category options may
						be unavailable.
					</div>
				)}

				{!kind ? (
					<>
						<div className="mb-5">
							<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
								What would you like to do?
							</h2>
							<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
								Choose a request type to open the right form.
							</p>
						</div>
						<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
							{feedbackKinds.map(({ id, title, description, icon: Icon }) => (
								<button
									key={id}
									type="button"
									onClick={() => startRequest(id)}
									className="flex h-full items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#c8102e]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
								>
									<span className="rounded-md bg-red-50 p-2.5 text-[#c8102e] dark:bg-red-950/50">
										<Icon size={20} />
									</span>
									<span className="flex-1">
										<span className="block font-semibold text-slate-900 dark:text-slate-100">
											{title}
										</span>
										<span className="mt-1 block text-sm leading-relaxed text-slate-500 dark:text-slate-400">
											{description}
										</span>
									</span>
									<ArrowRight size={18} className="mt-1 shrink-0 text-slate-400" />
								</button>
							))}
						</div>
					</>
				) : submitted ? (
					<section
						className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
						aria-live="polite"
					>
						<BadgeCheck size={36} className="mx-auto mb-3 text-[#c8102e]" />
						<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
							Your request is ready for review
						</h2>
						<p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
							The form is complete, but it has not been submitted or stored. Once the
							backend review endpoint is connected, this action will send it to the
							review team.
						</p>
						<div className="mt-5 flex flex-wrap justify-center gap-3">
							<button
								type="button"
								onClick={() => setSubmitted(false)}
								className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
							>
								Review my form
							</button>
							<button
								type="button"
								onClick={() => {
									setKind(null);
									setSubmitted(false);
									setDraft(emptyDraft);
								}}
								className="rounded-md bg-[#c8102e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a80d26]"
							>
								Start another request
							</button>
						</div>
					</section>
				) : (
					<section className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
						<button
							type="button"
							onClick={() => setKind(null)}
							className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline"
						>
							<ArrowLeft size={15} />
							Choose a different request
						</button>

						<div className="mb-6">
							<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
								{selectedKind?.title}
							</h2>
							<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
								Fields marked with * are required.
							</p>
						</div>

						<form onSubmit={submitForReview} className="space-y-5">
							{kind === 'suggest' ? (
								<>
									<label className="block">
										<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
											New resource name *
										</span>
										<input
											required
											maxLength={160}
											value={draft.resourceName}
											onChange={(event) =>
												setDraft({ ...draft, resourceName: event.target.value })
											}
											placeholder="e.g. Expense Reimbursement Portal"
											className={inputClassName}
										/>
									</label>

									<label className="block">
										<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
											Resource description *
										</span>
										<textarea
											required
											maxLength={1000}
											rows={4}
											value={draft.description}
											onChange={(event) =>
												setDraft({ ...draft, description: event.target.value })
											}
											placeholder="What does it help employees do?"
											className={inputClassName}
										/>
									</label>

									<div className="grid gap-5 sm:grid-cols-2">
										<label className="block">
											<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
												Resource type *
											</span>
											<select
												required
												value={draft.resourceTypeId}
												onChange={(event) =>
													setDraft({
														...draft,
														resourceTypeId: event.target.value,
													})
												}
												className={inputClassName}
												disabled={loadingOptions || resourceTypes.length === 0}
											>
												<option value="">
													{loadingOptions ? 'Loading types…' : 'Select a type'}
												</option>
												{resourceTypes.map((item) => (
													<option key={item.id} value={item.id}>
														{item.name}
													</option>
												))}
											</select>
										</label>

										<label className="block">
											<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
												Resource link
											</span>
											<span className="relative block">
												<LinkIcon
													size={16}
													className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
												/>
												<input
													type="url"
													maxLength={2048}
													value={draft.resourceUrl}
													onChange={(event) =>
														setDraft({
															...draft,
															resourceUrl: event.target.value,
														})
													}
													placeholder="https://"
													className={`${inputClassName} pl-9`}
												/>
											</span>
										</label>
									</div>

									<div className="grid gap-5 sm:grid-cols-2">
										<fieldset>
											<legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
												Related departments
											</legend>
											<div className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-3 dark:border-slate-700">
												{loadingOptions ? (
													<span className="inline-flex items-center gap-2 text-sm text-slate-500">
														<LoaderCircle size={15} className="animate-spin" />
														Loading…
													</span>
												) : departments.length ? (
													departments.map((item) => (
														<label
															key={item.id}
															className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
														>
															<input
																type="checkbox"
																checked={draft.departmentIds.includes(item.id)}
																onChange={() => toggleOption('departmentIds', item.id)}
																className="accent-[#c8102e]"
															/>
															{item.name}
														</label>
													))
												) : (
													<p className="text-sm text-slate-500">No departments loaded.</p>
												)}
											</div>
										</fieldset>

										<fieldset>
											<legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
												Related functions
											</legend>
											<div className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-3 dark:border-slate-700">
												{loadingOptions ? (
													<span className="inline-flex items-center gap-2 text-sm text-slate-500">
														<LoaderCircle size={15} className="animate-spin" />
														Loading…
													</span>
												) : functions.length ? (
													functions.map((item) => (
														<label
															key={item.id}
															className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
														>
															<input
																type="checkbox"
																checked={draft.functionIds.includes(item.id)}
																onChange={() => toggleOption('functionIds', item.id)}
																className="accent-[#c8102e]"
															/>
															{item.name}
														</label>
													))
												) : (
													<p className="text-sm text-slate-500">No functions loaded.</p>
												)}
											</div>
										</fieldset>
									</div>
								</>
							) : (
								<>
									<label className="block">
										<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
											Resource name *
										</span>
										<input
											required
											maxLength={160}
											value={draft.resourceName}
											onChange={(event) =>
												setDraft({ ...draft, resourceName: event.target.value })
											}
											placeholder="Name of the resource to review"
											className={inputClassName}
										/>
									</label>

									<label className="block">
										<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
											Current resource link (if known)
										</span>
										<input
											type="url"
											maxLength={2048}
											value={draft.resourceUrl}
											onChange={(event) =>
												setDraft({ ...draft, resourceUrl: event.target.value })
											}
											placeholder="https://"
											className={inputClassName}
										/>
									</label>

									{kind === 'updated' && (
										<label className="block">
											<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
												Updated or replacement link
											</span>
											<input
												type="url"
												maxLength={2048}
												value={draft.updatedUrl}
												onChange={(event) =>
													setDraft({ ...draft, updatedUrl: event.target.value })
												}
												placeholder="https://"
												className={inputClassName}
											/>
										</label>
									)}

									<label className="block">
										<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
											{kind === 'outdated'
												? 'What information is out of date? *'
												: kind === 'inactive'
													? 'Why is this resource no longer in use? *'
													: 'What has changed or been updated? *'}
										</span>
										<textarea
											required
											maxLength={2000}
											rows={5}
											value={draft.details}
											onChange={(event) =>
												setDraft({ ...draft, details: event.target.value })
											}
											placeholder="Include details that will help the review team verify this report."
											className={inputClassName}
										/>
									</label>
								</>
							)}

							<div className="grid gap-5 border-t border-slate-200 pt-5 dark:border-slate-700 sm:grid-cols-2">
								<label className="block">
									<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
										Your name
									</span>
									<input
										maxLength={120}
										autoComplete="name"
										value={draft.reporterName}
										onChange={(event) =>
											setDraft({ ...draft, reporterName: event.target.value })
										}
										className={inputClassName}
									/>
								</label>
								<label className="block">
									<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
										Contact email
									</span>
									<input
										type="email"
										maxLength={254}
										autoComplete="email"
										value={draft.reporterEmail}
										onChange={(event) =>
											setDraft({ ...draft, reporterEmail: event.target.value })
										}
										className={inputClassName}
									/>
								</label>
							</div>

							<div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
								<button
									type="button"
									onClick={() => setKind(null)}
									className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="inline-flex items-center gap-2 rounded-md bg-[#c8102e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#a80d26]"
								>
									Continue for review
									<ArrowRight size={16} />
								</button>
							</div>
						</form>
					</section>
				)}
			</main>
		</div>
	);
}

export default Feedback;

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	ArrowLeft,
	ArrowRight,
	BadgeCheck,
	BookPlus,
	CircleAlert,
	Clock3,
	ExternalLink,
	FilePenLine,
	Link as LinkIcon,
	LoaderCircle,
	MessageSquareWarning,
	RefreshCw,
	Trash2,
} from 'lucide-react';
import {
	createResourceSubmissionService,
	getDepartmentService,
	getFunctionService,
	getMySubmissionsService,
	getResourceService,
	type ResourceSubmission,
	type SubmissionCategory,
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

function isRejectedSubmission(submission: ResourceSubmission) {
	return [submission.status, submission.approval_status, submission.review_status]
		.some(
			(status) =>
				typeof status === 'string' && status.trim().toLowerCase() === 'rejected',
		);
}

function Feedback() {
	const [kind, setKind] = useState<FeedbackKind | null>(null);
	const [draft, setDraft] = useState<FeedbackDraft>(emptyDraft);
	const [submitted, setSubmitted] = useState(false);
	const [submissionSent, setSubmissionSent] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionError, setSubmissionError] = useState<string | null>(null);
	const [selectionError, setSelectionError] = useState<string | null>(null);
	const [departments, setDepartments] = useState<FeedbackOption[]>([]);
	const [functions, setFunctions] = useState<FeedbackOption[]>([]);
	const [resourceTypes, setResourceTypes] = useState<FeedbackOption[]>([]);
	const [loadingOptions, setLoadingOptions] = useState(true);
	const [optionsError, setOptionsError] = useState<string | null>(null);
	const [mySubmissions, setMySubmissions] = useState<ResourceSubmission[]>([]);
	const [delayedSubmissions, setDelayedSubmissions] = useState<
		Array<{ id: number; showAt: number }>
	>([]);
	const [loadingSubmissions, setLoadingSubmissions] = useState(true);
	const [submissionsError, setSubmissionsError] = useState<string | null>(null);

	const refreshSubmissions = useCallback(async () => {
		setLoadingSubmissions(true);
		setSubmissionsError(null);
		try {
			const submissions = await getMySubmissionsService();
			setMySubmissions(submissions);
			return submissions;
		} catch (error) {
			setSubmissionsError(
				error instanceof Error
					? error.message
					: 'Unable to load your submissions.',
			);
			return null;
		} finally {
			setLoadingSubmissions(false);
		}
	}, []);

	useEffect(() => {
		if (delayedSubmissions.length === 0) return;
		const nextShowAt = Math.min(...delayedSubmissions.map(({ showAt }) => showAt));
		const timeout = window.setTimeout(() => {
			const now = Date.now();
			setDelayedSubmissions((current) =>
				current.filter(({ showAt }) => showAt > now),
			);
			void refreshSubmissions();
		}, Math.max(0, nextShowAt - Date.now()));

		return () => window.clearTimeout(timeout);
	}, [delayedSubmissions, refreshSubmissions]);

	useEffect(() => {
		let cancelled = false;
		getMySubmissionsService()
			.then((submissions) => {
				if (!cancelled) setMySubmissions(submissions);
			})
			.catch((error: unknown) => {
				if (!cancelled) {
					setSubmissionsError(
						error instanceof Error
							? error.message
							: 'Unable to load your submissions.',
					);
				}
			})
			.finally(() => {
				if (!cancelled) setLoadingSubmissions(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

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
		setSelectionError(null);
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
		setSubmissionSent(false);
		setSubmissionError(null);
		setSelectionError(null);
		setKind(selectedKind);
	};

	const submitForReview = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmissionError(null);

		if (kind !== 'suggest') {
			setSubmissionSent(false);
			setSubmitted(true);
			return;
		}

		if (!draft.departmentIds.length || !draft.functionIds.length) {
			setSelectionError(
				'Select at least one department and one function for this resource.',
			);
			return;
		}
		if (
			!draft.resourceName.trim() ||
			!draft.description.trim() ||
			!draft.resourceTypeId ||
			!draft.reporterName.trim() ||
			!draft.reporterEmail.trim()
		) {
			setSubmissionError('Complete all required fields before submitting.');
			return;
		}

		setSelectionError(null);
		const resourceUrl = draft.resourceUrl.trim();
		try {
			const parsedUrl = new URL(resourceUrl);
			if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
				throw new Error('Use a resource link that starts with http:// or https://.');
			}
		} catch (error) {
			setSubmissionError(
				error instanceof Error && error.message.startsWith('Use a resource link')
					? error.message
					: 'Enter a valid resource link starting with http:// or https://.',
			);
			return;
		}

		setIsSubmitting(true);
		try {
			const previousSubmissionIds = new Set(mySubmissions.map(({ id }) => id));
			const showAt = Date.now() + 10_000;
			const createdSubmissionId = await createResourceSubmissionService({
				name: draft.resourceName.trim(),
				description: draft.description.trim(),
				url: resourceUrl,
				resource_type: Number(draft.resourceTypeId),
				departments: draft.departmentIds,
				functions: draft.functionIds,
				submitter_name: draft.reporterName.trim(),
				contact_email: draft.reporterEmail.trim(),
			});
			setSubmissionSent(true);
			setSubmitted(true);
			if (createdSubmissionId !== null) {
				setDelayedSubmissions((current) => [
					...current.filter(({ id }) => id !== createdSubmissionId),
					{ id: createdSubmissionId, showAt },
				]);
			}
			const refreshedSubmissions = await refreshSubmissions();
			if (createdSubmissionId === null && refreshedSubmissions) {
				const matchingNewSubmission = refreshedSubmissions
					.filter(
						(submission) =>
							!previousSubmissionIds.has(submission.id) &&
							submission.name === draft.resourceName.trim(),
					)
					.sort((first, second) => second.id - first.id)[0];

				if (matchingNewSubmission) {
					setDelayedSubmissions((current) => [
						...current.filter(({ id }) => id !== matchingNewSubmission.id),
						{ id: matchingNewSubmission.id, showAt },
					]);
				}
			}
		} catch (error) {
			setSubmissionError(
				error instanceof TypeError
					? 'We couldn’t connect to the submission service. Check your connection and try again.'
					: error instanceof Error
						? error.message
						: 'We couldn’t submit this resource suggestion. Please try again.',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const selectedKind = feedbackKinds.find((item) => item.id === kind);
	const visibleSubmissions = mySubmissions.filter(
		(submission) =>
			!isRejectedSubmission(submission) &&
			!delayedSubmissions.some(({ id }) => id === submission.id),
	);
	const getCategoryName = (
		category: SubmissionCategory,
		options: FeedbackOption[],
	) => {
		if (typeof category !== 'number') return category.name;
		return options.find((option) => option.id === category)?.name ?? `Category ${category}`;
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950">
			<div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
				<div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
					<div className="mb-3 text-sm text-slate-500 dark:text-slate-400">
						<Link to="/" className="hover:text-[#c8102e]">
							Home
						</Link>
						<span className="mx-2">›</span>
						<span className="font-medium text-slate-700 dark:text-slate-300">
							Feedback &amp; resource requests
						</span>
					</div>
					<h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
						Feedback &amp; resource requests
					</h1>
					<p className="mt-1 text-slate-500 dark:text-slate-400">
						Help keep the resource repository useful and up to date.
					</p>
				</div>
			</div>

			<main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
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
						className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
						aria-live="polite"
					>
						<BadgeCheck size={36} className="mx-auto mb-3 text-[#c8102e]" />
						<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
							{submissionSent
								? 'Resource suggestion submitted'
								: 'Your request is ready for review'}
						</h2>
						<p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
							{submissionSent
								? 'Your suggestion was sent to the review team. Thank you for helping keep the resource repository up to date.'
								: 'This request type is not connected to the review service yet, so it has not been submitted or stored.'}
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
									setSubmissionSent(false);
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

						<form
							onSubmit={submitForReview}
							onChange={() => {
								if (submissionError) setSubmissionError(null);
							}}
							className="space-y-5"
						>
							{submissionError && (
								<div
									className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
									role="alert"
									aria-live="polite"
								>
									<CircleAlert size={17} className="mt-0.5 shrink-0" />
									<p>{submissionError}</p>
								</div>
							)}

							{kind === 'suggest' ? (
								<>
									<label className="block">
										<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
											New resource name *
										</span>
										<input
											required
											maxLength={200}
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
												Resource link *
											</span>
											<span className="relative block">
												<LinkIcon
													size={16}
													className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
												/>
												<input
													type="url"
													required
													pattern="https?://.+"
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
												Related departments *
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
												Related functions *
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
									{selectionError && (
										<p className="text-sm text-red-700" role="alert">
											{selectionError}
										</p>
									)}
								</>
							) : (
								<>
									<label className="block">
										<span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
											Resource name *
										</span>
										<input
											required
											maxLength={200}
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
										Your name {kind === 'suggest' && '*'}
									</span>
									<input
										required={kind === 'suggest'}
										maxLength={150}
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
										Contact email {kind === 'suggest' && '*'}
									</span>
									<input
										type="email"
										required={kind === 'suggest'}
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
									disabled={isSubmitting || (kind === 'suggest' && loadingOptions)}
									className="inline-flex items-center gap-2 rounded-md bg-[#c8102e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#a80d26]"
								>
									{isSubmitting ? (
										<>
											<LoaderCircle size={16} className="animate-spin" />
											Submitting...
										</>
									) : (
										<>
											{kind === 'suggest' ? 'Submit suggestion' : 'Preview request'}
											<ArrowRight size={16} />
										</>
									)}
								</button>
							</div>
						</form>
					</section>
				)}

				<section className="mt-10">
					<div className="mb-4 flex flex-wrap items-end justify-between gap-3">
						<div>
							<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
								My submitted resources
							</h2>
							<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
								Resources you have sent for review.
							</p>
						</div>
						<button
							type="button"
							onClick={() => void refreshSubmissions()}
							disabled={loadingSubmissions}
							className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
						>
							<RefreshCw
								size={15}
								className={loadingSubmissions ? 'animate-spin' : ''}
							/>
							Refresh
						</button>
					</div>

					{delayedSubmissions.length > 0 && (
						<p className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
							Your new resource suggestion is awaiting review and will appear in
							this list shortly.
						</p>
					)}

					{loadingSubmissions && (
						<div
							className="flex min-h-28 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400"
							role="status"
						>
							<LoaderCircle size={18} className="animate-spin text-[#c8102e]" />
							Loading your submissions...
						</div>
					)}

					{submissionsError && (
						<div
							className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
							role="alert"
						>
							<CircleAlert size={17} className="mt-0.5 shrink-0" />
							<div className="flex-1">
								<p>{submissionsError}</p>
								<button
									type="button"
									onClick={() => void refreshSubmissions()}
									className="mt-2 font-medium underline"
								>
									Try again
								</button>
							</div>
						</div>
					)}

					{!loadingSubmissions &&
						!submissionsError &&
						visibleSubmissions.length === 0 && (
						<div className="rounded-lg border border-dashed border-slate-300 bg-white p-7 text-center dark:border-slate-700 dark:bg-slate-900">
							<BookPlus size={24} className="mx-auto mb-2 text-slate-400" />
							<p className="font-medium text-slate-800 dark:text-slate-200">
								{mySubmissions.some(isRejectedSubmission)
									? 'There are no submissions to display.'
									: 'You haven’t submitted any resources yet.'}
							</p>
							<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
								{mySubmissions.some(isRejectedSubmission)
									? 'Rejected suggestions are hidden from this list.'
									: 'Your suggestions will appear here after they are submitted.'}
							</p>
						</div>
					)}

					{!loadingSubmissions &&
						!submissionsError &&
						visibleSubmissions.length > 0 && (
						<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
							{visibleSubmissions.map((submission) => {
								const resourceTypeName = getCategoryName(
									submission.resource_type,
									resourceTypes,
								);
								const departmentNames = submission.departments.map((item) =>
									getCategoryName(item, departments),
								);
								const functionNames = submission.functions.map((item) =>
									getCategoryName(item, functions),
								);
								const submittedDate = submission.created_at
									? new Date(submission.created_at)
									: null;

								return (
									<article
										key={submission.id}
										className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
									>
										<div className="flex items-start justify-between gap-3">
											<div>
												<h3 className="font-semibold text-slate-900 dark:text-slate-100">
													{submission.name}
												</h3>
												<p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
													{resourceTypeName}
												</p>
											</div>
											<span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium capitalize text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
												{submission.status || 'Submitted'}
											</span>
										</div>

										<p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
											{submission.description}
										</p>

										{(departmentNames.length > 0 || functionNames.length > 0) && (
											<div className="mt-4 flex flex-wrap gap-2">
												{departmentNames.map((name) => (
													<span
														key={`department-${name}`}
														className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-[#c8102e] dark:bg-red-950/50"
													>
														{name}
													</span>
												))}
												{functionNames.map((name) => (
													<span
														key={`function-${name}`}
														className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
													>
														{name}
													</span>
												))}
											</div>
										)}

										<div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
											<p className="text-xs text-slate-500 dark:text-slate-400">
												{submittedDate && !Number.isNaN(submittedDate.getTime())
													? `Submitted ${submittedDate.toLocaleDateString()}`
													: 'Submitted'}
											</p>
											{submission.url && (
												<a
													href={submission.url}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline"
												>
													Open resource <ExternalLink size={14} />
												</a>
											)}
										</div>
									</article>
								);
								})}
						</div>
					)}
				</section>
			</main>
		</div>
	);
}

export default Feedback;

import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

export interface EntityCardProps {
	icon: LucideIcon;
	title: string;
	subtitle?: string;
	description?: string;
	linkLabel: string;
	onClick?: () => void;
}

function EntityCard({
	icon: Icon,
	title,
	subtitle,
	description,
	linkLabel,
	onClick,
}: EntityCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="group flex h-full min-h-48 w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm shadow-slate-900/[0.02] transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-slate-900/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900 dark:hover:shadow-black/20 sm:p-6"
		>
			<div className="flex items-start justify-between gap-4">
				<span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-[#c8102e] transition group-hover:bg-[#c8102e] group-hover:text-white dark:bg-red-950/50 dark:text-red-300 dark:group-hover:bg-[#c8102e] dark:group-hover:text-white">
					<Icon size={21} aria-hidden="true" />
				</span>
				<span className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition group-hover:bg-red-50 group-hover:text-[#c8102e] dark:text-slate-500 dark:group-hover:bg-red-950/50 dark:group-hover:text-red-300">
					<ArrowUpRight size={18} aria-hidden="true" />
				</span>
			</div>
			<div className="mt-5">
				<h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
					{title}
				</h2>
				{subtitle && (
					<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
						{subtitle}
					</p>
				)}
				{description && (
					<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
						{description}
					</p>
				)}
			</div>
			<span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#c8102e] dark:text-red-300">
				{linkLabel}
				<ArrowUpRight
					size={15}
					aria-hidden="true"
					className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
				/>
			</span>
		</button>
	);
}

export default EntityCard;

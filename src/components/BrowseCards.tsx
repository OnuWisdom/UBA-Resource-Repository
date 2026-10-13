import { ArrowUpRight } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
	title: string;
	description?: string;
	icon: React.ReactNode;
	route?: string;
}

function BrowseCard({
	title,
	description,
	icon,
	route = '/department',
}: CardProps) {
	return (
		<Link
			to={route}
			className="group relative flex min-h-48 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-slate-900/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900 dark:hover:shadow-black/20 sm:p-6"
		>
			<div className="flex items-start justify-between gap-4">
				<span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-[#c8102e] transition group-hover:bg-[#c8102e] group-hover:text-white dark:bg-red-950/50 dark:text-red-300 dark:group-hover:bg-[#c8102e] dark:group-hover:text-white [&_svg]:h-5 [&_svg]:w-5">
					{icon}
				</span>
				<span className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition group-hover:bg-red-50 group-hover:text-[#c8102e] dark:text-slate-500 dark:group-hover:bg-red-950/50 dark:group-hover:text-red-300">
					<ArrowUpRight size={18} aria-hidden="true" />
				</span>
			</div>
			<div className="mt-5">
				<h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
					{title}
				</h3>
				{description && (
					<p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
						{description}
					</p>
				)}
			</div>
		</Link>
	);
}

export default BrowseCard;

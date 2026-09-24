import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

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
		<div
			onClick={onClick}
			className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col h-full cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
		>
			<div className="flex items-start gap-3 mb-3">
				<div className="bg-red-50 p-2.5 rounded-md">
					<Icon className="text-[#c8102e]" size={20} />
				</div>
				<div>
					<h3 className="font-semibold text-slate-900 text-base leading-tight">
						{title}
					</h3>
					{subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
				</div>
			</div>

			{description && (
				<p className="text-sm text-slate-600 leading-relaxed mb-4">{description}</p>
			)}

			<div className="mt-auto pt-3">
				<span className="flex items-center gap-1 text-sm font-medium text-[#c8102e] hover:underline">
					{linkLabel}
					<ArrowRight size={14} />
				</span>
			</div>
		</div>
	);
}

export default EntityCard;

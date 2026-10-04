// import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
	title: string;
	description?: string;
	icon: React.ReactNode;
	route?: string;
}

function BrowseCard({ title, description, icon, route = '/department' }: CardProps) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(route);
	};
	return (
		<div
			onClick={handleClick}
			className="flex flex-col relative bg-white border border-slate-200 transition-all duration-800 hover:-translate-y-1 hover:border-[#c8102e]/50 hover:shadow-lg rounded-lg shadow-sm p-6 m-4"
		>
			<div className="flex items-start gap-3">
				<div>{icon}</div>
				<div className="flex-1 pr-8">
					<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
					{description && (
						<p className="mt-2 text-sm text-slate-600 leading-relaxed">
							{description}
						</p>
					)}
				</div>
			</div>
			<div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
				<ArrowRight size={20} />
			</div>
		</div>
	);
}

export default BrowseCard;

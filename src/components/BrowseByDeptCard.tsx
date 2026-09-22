// import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
	title: string;
	icon: React.ReactNode;
	// linkTo: string;
}

function BrowseByDeptCard({ title, icon }: CardProps) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate('/department');
	};
	return (
		<div
			onClick={handleClick}
			className="flex relative bg-white border border-slate-200 transition-all duration-800 hover:-translate-y-1 hover:border-[#c8102e]/50 hover:shadow-lg rounded-lg shadow-sm p-6 m-4"
		>
			<div>{icon}</div>
			<h3 className="text-lg font-semibold text-gray-900 pl-8">{title}</h3>
			<div className="absolute right-0 pr-10 text-slate-400">
				<ArrowRight size={20} />
			</div>
		</div>
	);
}

export default BrowseByDeptCard;

import { Link } from 'react-router-dom';

interface CardProps {
	title: string;
	subtitle: string;
	body: string;
	linkTo: string;
	dept: string;
	role: string;
}

function Card({ title, subtitle, body, dept, role, linkTo }: CardProps) {
	return (
		<div className="bg-white border border-slate-200 transition-all duration-800 hover:-translate-y-1 hover:border-[#c8102e]/50 hover:shadow-lg rounded-lg shadow-sm p-6">
			<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
			<p className="text-sm text-gray-500 mb-3">{subtitle}</p>
			<p className="text-gray-600 text-sm mb-4">{body}</p>
			<p>
				<span className="text-[#c8102e] font-medium">{dept}</span>{' '}
				<span className="text-xs bg-slate-100 rounded-xl px-2 py-1">{role}</span>
			</p>
			<div className="flex justify-around border-t border-gray-200 pt-2 mt-4">
				<span className="text-sm">3 User Groups</span>
				<Link
					to={linkTo}
					className="text-[#c8102e] font-bold text-md hover:underline "
				>
					View details &rarr;
				</Link>
			</div>
		</div>
	);
}

export default Card;

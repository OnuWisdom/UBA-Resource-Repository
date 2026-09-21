import { Link, useNavigate } from 'react-router-dom';

interface CardProps {
	title: string;
	// linkTo: string;
}

function BrowseByDeptCard({ title }: CardProps) {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate('/');
	};
	return (
		<div
			onClick={handleClick}
			className="bg-white border border-slate-200 transition-all duration-800 hover:-translate-y-1 hover:border-[#c8102e]/50 hover:shadow-lg rounded-lg shadow-sm p-6"
		>
			<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
			<div className="flex justify-around border-t border-gray-200 pt-2 mt-4">
				<span className="text-sm">3 User Groups</span>
				{/* <Link
					to={linkTo}
					className="text-[#c8102e] font-bold text-md hover:underline "
				>
					View details &rarr;
				</Link> */}
			</div>
		</div>
	);
}

export default BrowseByDeptCard;

import {
	Info,
	Compass,
	Search,
	Layers,
	Eye,
	CircleHelp,
	Phone,
	Mail,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function About() {
	const navigate = useNavigate();
	return (
		<div className="">
			<div className="border-b border-slate-100 shadow-sm">
				<div className="max-w-4xl mx-auto px-6 py-5">
					<div className="text-sm text-slate-500 mb-2">
						<span
							className="cursor-pointer hover:text-slate-400"
							onClick={() => navigate('/')}
						>
							Home{' '}
						</span>
						<span className="mx-2">›</span>{' '}
						<span className="text-slate-800">About</span>
					</div>

					<h1 className="text-2xl font-bold text-slate-900">About & Help</h1>

					<p className="text-slate-600 mt-1">
						Learn how the UBA Digital Resource Repository works and where to get
						support.
					</p>
				</div>
			</div>

			<div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
				<div className="bg-white rounded-xl p-5 shadow-md">
					<div className="flex items-center gap-3 mb-4">
						<Info className="text-red-500" size={18} />

						<h2 className="font-semibold text-lg">What is this?</h2>
					</div>

					<p className="text-sm leading-6 text-slate-600">
						The UBA Digital Resource Repository is a centralized, searchable directory
						of the organization's internal digital resources — platforms,
						applications, portals, services, guides, documents, and forms. It helps
						employees, especially new ones, quickly answer:{' '}
						<strong className="text-slate-900">
							"What resource do I need, what is it used for, and how do I access it?"
						</strong>
					</p>
				</div>

				<div className="bg-white rounded-xl p-5 shadow-md">
					<div className="flex items-center gap-3 mb-6">
						<Compass className="text-red-500" size={18} />

						<h2 className="font-semibold text-lg">How to use this repository</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<Search className="text-red-500 mb-4" size={18} />

							<h3 className="font-medium text-sm mb-2">Search</h3>

							<p className="text-sm text-slate-500 leading-5">
								Use the search bar to find resources by name, keyword, or description.
							</p>
						</div>

						<div>
							<Layers className="text-red-500 mb-4" size={18} />

							<h3 className="font-medium text-sm mb-2">Browse</h3>

							<p className="text-sm text-slate-500 leading-5">
								Explore by department, function, or resource type to discover what's
								available.
							</p>
						</div>

						<div>
							<Eye className="text-red-500 mb-4" size={18} />

							<h3 className="font-medium text-sm mb-2">View Details</h3>

							<p className="text-sm text-slate-500 leading-5">
								Open any resource to see its purpose, access requirements, and related
								resources.
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl p-5 shadow-md">
					<div className="flex items-center gap-3 mb-5">
						<div className="bg-yellow-100 p-2 rounded-md">
							<CircleHelp className="text-yellow-600" size={18} />
						</div>

						<h2 className="font-semibold text-lg">Need Help?</h2>
					</div>

					<div className="space-y-3">
						<div className="bg-slate-50 rounded-lg p-4 flex gap-3">
							<div className="bg-white p-2 rounded-md h-fit">
								<Phone className="text-red-500" size={17} />
							</div>

							<div>
								<h3 className="font-medium text-sm">IT Service Desk</h3>

								<p className="text-sm text-slate-500">
									For technical issues, access problems, or system support.
								</p>

								<a href="#" className="text-sm text-red-500 hover:underline">
									Visit IT Service Desk →
								</a>
							</div>
						</div>

						<div className="bg-slate-50 rounded-lg p-4 flex gap-3">
							<div className="bg-white p-2 rounded-md h-fit">
								<Mail className="text-red-500" size={17} />
							</div>

							<div>
								<h3 className="font-medium text-sm">HR Support</h3>

								<p className="text-sm text-slate-500">
									For questions about HR systems, leave, or employee services.
								</p>

								<a href="#" className="text-sm text-red-500 hover:underline">
									Browse HR Resources →
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;

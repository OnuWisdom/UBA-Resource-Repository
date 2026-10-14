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
import { Link } from 'react-router-dom';

function About() {
	return (
		<div className="bg-white dark:bg-slate-950">
			<div className="border-b border-slate-100 dark:border-slate-800 shadow-sm">
				<div className="max-w-4xl mx-auto px-4 py-5 sm:px-6 sm:py-6">
					<div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
						<Link
							to="/"
							className="rounded-sm hover:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:hover:text-slate-300"
						>
							Home
						</Link>
						<span className="mx-2">›</span>{' '}
						<span className="text-slate-800 dark:text-slate-200">About</span>
					</div>

					<h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
						About & Help
					</h1>

					<p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
						Learn how the UBA Digital Resource Repository works and where to get
						support.
					</p>
				</div>
			</div>

			<div className="max-w-3xl mx-auto space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
				<div className="rounded-xl border border-slate-100 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-5">
					<div className="flex items-center gap-3 mb-4">
						<Info className="text-red-500 dark:text-red-400" size={18} />

						<h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
							What is this?
						</h2>
					</div>

					<p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
						The UBA Digital Resource Repository is a centralized, searchable directory
						of the organization's internal digital resources — platforms,
						applications, portals, services, guides, documents, and forms. It helps
						employees, especially new ones, quickly answer:{' '}
						<strong className="text-slate-900 dark:text-slate-100">
							"What resource do I need, what is it used for, and how do I access it?"
						</strong>
					</p>
				</div>

				<div className="rounded-xl border border-slate-100 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-5">
					<div className="flex items-center gap-3 mb-6">
						<Compass className="text-red-500 dark:text-red-400" size={18} />

						<h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
							How to use this repository
						</h2>
					</div>

					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
						<div>
							<Search className="text-red-500 dark:text-red-400 mb-4" size={18} />

							<h3 className="font-medium text-sm mb-2 text-slate-900 dark:text-slate-100">
								Search
							</h3>

							<p className="text-sm text-slate-500 dark:text-slate-400 leading-5">
								Use the search bar to find resources by name, keyword, or description.
							</p>
						</div>

						<div>
							<Layers className="text-red-500 dark:text-red-400 mb-4" size={18} />

							<h3 className="font-medium text-sm mb-2 text-slate-900 dark:text-slate-100">
								Browse
							</h3>

							<p className="text-sm text-slate-500 dark:text-slate-400 leading-5">
								Explore by department, function, or resource type to discover what's
								available.
							</p>
						</div>

						<div>
							<Eye className="text-red-500 dark:text-red-400 mb-4" size={18} />

							<h3 className="font-medium text-sm mb-2 text-slate-900 dark:text-slate-100">
								View Details
							</h3>

							<p className="text-sm text-slate-500 dark:text-slate-400 leading-5">
								Open any resource to see its purpose, access requirements, and related
								resources.
							</p>
						</div>
					</div>
				</div>

				<div className="rounded-xl border border-slate-100 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-5">
					<div className="flex items-center gap-3 mb-5">
						<div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-md">
							<CircleHelp className="text-yellow-600 dark:text-yellow-400" size={18} />
						</div>

						<h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
							Need Help?
						</h2>
					</div>

					<div className="space-y-3">
						<div className="flex min-w-0 gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800 sm:p-4">
							<div className="h-fit shrink-0 rounded-md bg-white p-2 dark:bg-slate-900">
								<Phone className="text-red-500 dark:text-red-400" size={17} />
							</div>

							<div className="min-w-0">
								<h3 className="font-medium text-sm text-slate-900 dark:text-slate-100">
									IT Service Desk
								</h3>

								<p className="text-sm leading-5 text-slate-500 dark:text-slate-400">
									For technical issues, access problems, or system support.
								</p>

								<a
									href="mailto:ITcare@ubagroup.com"
									className="inline-block min-h-11 py-2 text-sm text-red-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:text-red-400"
								>
									Report to IT →
								</a>
							</div>
						</div>

						<div className="flex min-w-0 gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800 sm:p-4">
							<div className="h-fit shrink-0 rounded-md bg-white p-2 dark:bg-slate-900">
								<Mail className="text-red-500 dark:text-red-400" size={17} />
							</div>

							<div className="min-w-0">
								<h3 className="font-medium text-sm text-slate-900 dark:text-slate-100">
									HR Support
								</h3>

								<p className="text-sm leading-5 text-slate-500 dark:text-slate-400">
									For questions about HR systems, leave, or employee services.
								</p>

								<Link
									to="/department/human-resources"
									className="inline-block min-h-11 py-2 text-sm text-red-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] dark:text-red-400"
								>
									Browse HR Resources →
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default About;

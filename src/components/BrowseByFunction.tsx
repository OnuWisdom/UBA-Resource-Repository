import {
	Briefcase,
	ChartColumn,
	ChartNoAxesCombined,
	GitPullRequestDraft,
	HeartHandshake,
	Lock,
	MessageSquare,
	School,
	type LucideIcon,
} from 'lucide-react';
import BrowseCard from './BrowseCards';
import { useEffect, useState } from 'react';
import { getFunctionService } from '../services/queryServices';

const deptIcons: Record<string, LucideIcon> = {
	'access-and-security': Lock,
	'employee-services': HeartHandshake,
	learning: School,
	communication: MessageSquare,
	performance: ChartNoAxesCombined,
	reporting: ChartColumn,
	requests: GitPullRequestDraft,
};

interface Department {
	id: number;
	name: string;
	slug: string;
	description: string;
}

const default_icon: LucideIcon = Briefcase;

function BrowseByFunction() {
	const [functionData, setFunctionData] = useState<Department[]>([]);

	useEffect(() => {
		const loadDept = async () => {
			try {
				const data = await getFunctionService();

				setFunctionData(data);
				console.log(data);
			} catch (err) {
				console.log('Failed to load ', err);
				console.log(err instanceof Error ? err.message : 'Failed to load');
			}
		};

		loadDept();
	}, []);

	return (
		<section className="bg-white py-14 dark:bg-slate-900 sm:py-16">
			<div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
				<div className="mb-7 flex flex-col justify-between gap-2 sm:mb-8 sm:flex-row sm:items-end">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c8102e]">
							Explore what you do
						</p>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
							Browse by function
						</h2>
						<p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
							Find the services and resources that support your day-to-day work.
						</p>
					</div>
					<p className="text-sm text-slate-400 dark:text-slate-500">
						{functionData.length} functions
					</p>
				</div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{functionData.map((dept) => {
						const Icon = deptIcons[dept.slug] || default_icon;
						return (
							<BrowseCard
								key={dept.id}
								title={dept.name}
								description={dept.description}
								icon={<Icon />}
								route={`/functions/${dept.slug}`}
							/>
						);
					})}
				</div>
			</div>
		</section>
	);
}
export default BrowseByFunction;

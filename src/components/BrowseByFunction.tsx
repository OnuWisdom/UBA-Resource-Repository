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
	request: GitPullRequestDraft,
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
		<div>
			<h1 className="font-bold text-xl text-center p-4 bg-slate-50">
				Browse by Function
			</h1>
			<div className="w-[70%] mx-auto m-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{functionData.map((dept) => {
					const Icon = deptIcons[dept.slug] || default_icon;
					return <BrowseCard key={dept.id} title={dept.name} icon={<Icon />} />;
				})}
				;
			</div>
		</div>
	);
}
export default BrowseByFunction;

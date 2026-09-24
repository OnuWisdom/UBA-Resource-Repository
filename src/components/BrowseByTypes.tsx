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
import { getResourceService } from '../services/queryServices';

const deptIcons: Record<string, LucideIcon> = {
	application: Lock,
	document: HeartHandshake,
	form: School,
	guide: MessageSquare,
	platform: ChartNoAxesCombined,
	portal: ChartColumn,
	service: GitPullRequestDraft,
};

interface Department {
	id: number;
	name: string;
	slug: string;
	description: string;
}

const default_icon: LucideIcon = Briefcase;

function BrowseByTypes() {
	const [typesData, setTypesData] = useState<Department[]>([]);

	useEffect(() => {
		const loadDept = async () => {
			try {
				const data = await getResourceService();

				setTypesData(data);
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
				Browse by Types
			</h1>
			<div className="m-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{typesData.map((dept) => {
					const Icon = deptIcons[dept.slug] || default_icon;
					return <BrowseCard key={dept.id} title={dept.name} icon={<Icon />} />;
				})}
				;
			</div>
		</div>
	);
}
export default BrowseByTypes;

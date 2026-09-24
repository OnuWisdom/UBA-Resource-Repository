import {
	Briefcase,
	FileSearch,
	PiggyBank,
	Settings,
	ShieldAlert,
	TvMinimal,
	Users,
	Wallet,
	type LucideIcon,
} from 'lucide-react';
import BrowseCard from './BrowseCards';
import { useEffect, useState } from 'react';
import { getDepartmentService } from '../services/queryServices';

const deptIcons: Record<string, LucideIcon> = {
	'human-resources': Users,
	'information-technology': TvMinimal,
	finance: Wallet,
	operations: Settings,
	risk: ShieldAlert,
	treasury: PiggyBank,
	'internal-audit': FileSearch,
};

interface Department {
	id: number;
	name: string;
	slug: string;
	description: string;
}

const default_icon: LucideIcon = Briefcase;

function BrowseByDept() {
	const [deptData, setDeptData] = useState<Department[]>([]);

	useEffect(() => {
		const loadDept = async () => {
			try {
				const data = await getDepartmentService();

				setDeptData(data);
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
				Browse by Department
			</h1>
			<div className="m-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{deptData.map((dept) => {
					const Icon = deptIcons[dept.slug] || default_icon;
					return <BrowseCard key={dept.id} title={dept.name} icon={<Icon />} />;
				})}
				;
			</div>
		</div>
	);
}
export default BrowseByDept;

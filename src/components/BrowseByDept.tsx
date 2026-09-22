import { FileSearch, PiggyBank, Settings, ShieldAlert, TvMinimal, Users, Wallet } from 'lucide-react';
import BrowseByDeptCard from './BrowseByDeptCard';

const deptData = [
	{
		id: 1,
		title: 'Human Resources',
		icon: <Users />,
	},
	{
		id: 2,
		title: 'Information Technology',
		icon: <TvMinimal />,
	},
	{
		id: 3,
		title: 'Finance',
		icon: <Wallet />,
	},
	{
		id: 4,
		title: 'Operations',
		icon: <Settings />,
	},
	{
		id: 5,
		title: 'Risk',
		icon: <ShieldAlert />,
	},
	{
		id: 6,
		title: 'Treasury',
		icon: <PiggyBank />,
	},
	{
		id: 7,
		title: 'Internal Audit',
		icon: <FileSearch />,
	},
];

function BrowseByDept() {
	return (
		<div>
			<h1 className="font-bold text-xl text-center p-4 bg-slate-50">
				Browse by Department
			</h1>
			<div className="m-10">
				{deptData.map((dept) => (
					<BrowseByDeptCard key={dept.id} title={dept.title} icon={dept.icon} />
				))}
				;
			</div>
		</div>
	);
}
export default BrowseByDept;

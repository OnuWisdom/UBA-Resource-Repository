import {
	Users,
	Monitor,
	Wallet,
	Settings,
	ShieldAlert,
	Landmark,
	FileText,
} from 'lucide-react';
import EntityBrowsePage from '../utils/Entitybrowsepage';
import { getDepartmentService } from '../services/queryServices';

const deptIcons = {
	'human-resources': Users,
	'information-technology': Monitor,
	finance: Wallet,
	operations: Settings,
	risk: ShieldAlert,
	treasury: Landmark,
	'internal-audit': FileText,
};

function Departments() {
	return (
		<EntityBrowsePage
			pageTitle="Browse by Department"
			pageSubtitle="Explore digital resources organized by the department that owns them."
			breadcrumbLabel="Departments"
			fetchService={getDepartmentService}
			iconMap={deptIcons}
			routeBase="/department"
		/>
	);
}

export default Departments;

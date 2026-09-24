import {
	ShieldCheck,
	MessageSquare,
	Users,
	GraduationCap,
	TrendingUp,
	LineChart,
	ClipboardList,
	FileText,
} from 'lucide-react';
import EntityBrowsePage from '../utils/Entitybrowsepage';
import { getFunctionService } from '../services/queryServices';

const functionIcons = {
	'access-and-security': ShieldCheck,
	communication: MessageSquare,
	'employee-services': Users,
	learning: GraduationCap,
	performance: TrendingUp,
	reporting: LineChart,
	requests: ClipboardList,
};

function Functions() {
	return (
		<EntityBrowsePage
			pageTitle="Browse by Function"
			pageSubtitle="Explore digital resources organized by business function."
			breadcrumbLabel="Functions"
			fetchService={getFunctionService}
			iconMap={functionIcons}
			defaultIcon={FileText}
			routeBase="/functions"
		/>
	);
}

export default Functions;

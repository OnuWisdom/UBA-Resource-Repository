import {
	LayoutGrid,
	FileStack,
	ClipboardList,
	BookOpen,
	Monitor,
	DoorOpen,
	Wrench,
	FileText,
} from 'lucide-react';
import EntityBrowsePage from '../utils/Entitybrowsepage';
import { getResourceService } from '../services/queryServices';

const resourceTypeIcons = {
	application: LayoutGrid,
	document: FileStack,
	form: ClipboardList,
	guide: BookOpen,
	platform: Monitor,
	portal: DoorOpen,
	service: Wrench,
};

function ResourceTypes() {
	return (
		<EntityBrowsePage
			pageTitle="Browse by Resource Type"
			pageSubtitle="Explore digital resources organized by type."
			breadcrumbLabel="Resource Types"
			fetchService={getResourceService}
			iconMap={resourceTypeIcons}
			defaultIcon={FileText}
			routeBase="/resource-types"
		/>
	);
}

export default ResourceTypes;

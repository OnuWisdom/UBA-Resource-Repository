import BrowseByDept from '../components/BrowseByDept';
import BrowseByFunction from '../components/BrowseByFunction';
import Far from '../components/Far';
import Hero from '../components/Hero';

function Dashboard() {
	return (
		<>
			<Hero />
			<BrowseByDept />
			<BrowseByFunction />
			<Far />
		</>
	);
}
export default Dashboard;

import BrowseByDept from '../components/BrowseByDept';
import BrowseByFunction from '../components/BrowseByFunction';
// import BrowseByTypes from '../components/BrowseByTypes';
import Far from '../components/Far';
import Hero from '../components/Hero';
import WelcomeModal from '../components/WelcomeModal';

function Dashboard() {
	return (
		<>
			<WelcomeModal />
			<Hero />
			<BrowseByDept />
			<BrowseByFunction />
			{/* <BrowseByTypes /> */}
			<Far />
		</>
	);
}
export default Dashboard;

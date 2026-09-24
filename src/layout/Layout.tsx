import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Layout() {
	return (
		<>
			<header className="fixed top-0 right-0 left-0 z-10">
				<Header />
			</header>

			<main className="pt-16">
				<Outlet />
			</main>

			<Footer />
		</>
	);
}

export default Layout;

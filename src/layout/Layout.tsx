import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ResourceChatbot from '../components/ResourceChatbot';
import { FavoritesProvider } from '../context/FavoritesProvider';

function Layout() {
	return (
		<FavoritesProvider>
			<>
				<header className="fixed top-0 right-0 left-0 z-40">
					<Header />
				</header>

				<main className="pt-16">
					<Outlet />
				</main>

				<Footer />
				<ResourceChatbot />
			</>
		</FavoritesProvider>
	);
}

export default Layout;

import './App.css';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes';
import Layout from './layout/Layout';
import Search from './pages/Search';
import Functions from './pages/Function';
import Departments from './pages/Department';
import ResourceTypes from './pages/Resources';
import EntityDetail from './pages/EntityDetail';
import Feedback from './pages/Feedback';

function App() {
	return (
		<Routes>
			<Route path="/login" element={<SignIn />} />

			<Route element={<ProtectedRoutes />}>
				<Route element={<Layout />}>
					<Route path="/" element={<Dashboard />} />
					<Route path="/about" element={<About />} />
					<Route path="/search" element={<Search />} />
					<Route path="/functions" element={<Functions />} />
					<Route path="/department" element={<Departments />} />
					<Route path="/resources" element={<ResourceTypes />} />
					<Route path="/feedback" element={<Feedback />} />
					<Route path="/:type/:slug" element={<EntityDetail />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;

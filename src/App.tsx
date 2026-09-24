import './App.css';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes';
import Layout from './layout/Layout';

function App() {
	return (
		<Routes>
			<Route path="/login" element={<SignIn />} />

			<Route element={<ProtectedRoutes />}>
				<Route element={<Layout />}>
					<Route path="/" element={<Dashboard />} />
					<Route path="/about" element={<About />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;

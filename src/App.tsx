import './App.css';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes';

function App() {
	return (
		<Routes>
			<Route path="/login" element={<SignIn />} />

			<Route element={<ProtectedRoutes />}>
				<Route path="/" element={<Dashboard />} />
				<Route path="/about" element={<About />} />
			</Route>
		</Routes>
	);
}

export default App;

import './App.css';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import { Routes, Route } from 'react-router-dom';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/login" element={<SignIn />} />
			<Route path="/about" element={<About />} />
		</Routes>
	);
}

export default App;

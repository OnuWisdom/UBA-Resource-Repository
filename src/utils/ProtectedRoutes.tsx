import { Navigate, Outlet } from 'react-router-dom';
import SessionTimeout from './SessionTimeout';

function ProtectedRoutes() {
	const token = sessionStorage.getItem('token');

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return (
		<>
			<SessionTimeout />
			<Outlet />
		</>
	);
}
export default ProtectedRoutes;

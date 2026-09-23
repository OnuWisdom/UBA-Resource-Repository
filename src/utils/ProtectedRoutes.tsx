import { Navigate, Outlet } from 'react-router-dom';
import SessionTimeout from './SessionTimeout.';

function ProtectedRoutes() {
	const token = sessionStorage.getItem('token');

	<SessionTimeout />;

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}
export default ProtectedRoutes;

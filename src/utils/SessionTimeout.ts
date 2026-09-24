import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SessionTimeout() {
	const navigate = useNavigate();

	useEffect(() => {
		const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

		let idleTimer: ReturnType<typeof setTimeout>;

		const resetTimer = () => {
			clearTimeout(idleTimer);

			idleTimer = setTimeout(
				() => {
					sessionStorage.removeItem('token');
					navigate('/login', { replace: true });
				},
				// 1 * 60 * 1000,
				5 * 60 * 1000,
			);
		};

		events.forEach((event) => {
			window.addEventListener(event, resetTimer);
		});

		resetTimer();

		return () => {
			clearTimeout(idleTimer);

			events.forEach((event) => {
				window.removeEventListener(event, resetTimer);
			});
		};
	}, [navigate]);

	return null;
}

export default SessionTimeout;

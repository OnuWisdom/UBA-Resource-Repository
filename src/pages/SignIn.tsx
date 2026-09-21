import LoginFooter from '../components/LoginFooter';
import Login from '../components/LogInForm';
import LoginHeader from '../components/LoginHeader';

function SignIn() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1519608487953-e999c86e7455')] bg-cover bg-center relative">
			<div className="absolute inset-0 bg-black/70"></div>

			<div className="absolute top-0 left-0 right-0 flex justify-around items-center p-4">
				<LoginHeader />
			</div>

			<div className="relative w-full max-w-md bg-white rounded-md px-8 py-9 shadow-xl">
				<Login />
			</div>

			<div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4">
				<LoginFooter />
			</div>
		</div>
	);
}
export default SignIn;

import LoginFooter from '../components/LoginFooter';
import Login from '../components/LogInForm';
import LoginHeader from '../components/LoginHeader';

function SignIn() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			{/* Header */}
			<div className="absolute top-0 left-0 right-0 flex justify-around items-center p-4">
				<LoginHeader />
			</div>

			{/* Image + Login */}
			<div className="flex w-full min-h-screen">
				{/* Image */}
				<div className="w-1/2">
					<img
						src="/urr1.jpeg"
						alt="background"
						className="w-full h-full object-cover"
					/>
				</div>

				{/* Login */}
				<div className="w-1/2 flex items-center justify-center">
					<div className="w-full max-w-md bg-white rounded-md px-8 py-9 shadow-xl">
						<Login />
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4">
				<LoginFooter />
			</div>
		</div>
	);
}

export default SignIn;

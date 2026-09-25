import LoginFooter from '../components/LoginFooter';
import Login from '../components/LogInForm';
import LoginHeader from '../components/LoginHeader';

function SignIn() {
	return (
		<div className="relative min-h-screen bg-[url('/urr3.jpeg')] bg-cover bg-center">
			<div className="absolute inset-0 bg-black/40"></div>

			<div className="absolute top-0 left-0 right-0 z-10 flex justify-around items-center p-4">
				<LoginHeader />
			</div>

			<div className="relative z-10 min-h-screen flex items-center px-16">
				<div className="w-full flex items-center justify-between">
					{/* Left - Writeup */}
					<div className="w-1/2 text-left text-white">
						<h1 className="text-4xl font-bold leading-tight">Stop Guessing,</h1>
						<h1 className="text-4xl font-bold leading-tight">Start Finding</h1>
						<p className="text-xl text-white/80 mt-4">
							Your One stop to all things resource
						</p>
					</div>

					{/* Right - Login Form */}
					<div className="w-full max-w-md bg-white/85 backdrop-blur-sm rounded-md px-8 py-9 shadow-2xl">
						<Login />
					</div>
				</div>
			</div>

			<div className="absolute bottom-0 left-0 right-0 z-10 flex justify-between items-center p-4">
				<LoginFooter />
			</div>
		</div>
	);
}

export default SignIn;

// {/* <div className="relative flex w-full min-h-screen">
// 				{/* Image */}
// 				<div className="w-full">
// 					<img
// 						src="/urr3.jpeg"
// 						alt="background"
// 						className="w-full h-full object-cover"
// 					/>
// 				</div> */}

{
	/* <div className="relative z-10 min-h-screen flex items-center justify-end">
	<div className="w-full max-w-md bg-white/60 rounded-md px-8 py-9 shadow-xl mr-80">
		<Login />
	</div>
</div>; */
}

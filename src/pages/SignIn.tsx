import LoginFooter from '../components/LoginFooter';
import Login from '../components/LogInForm';
import LoginHeader from '../components/LoginHeader';

function SignIn() {
	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950">
			<div
				className="absolute inset-0 bg-[url('/urr3.jpeg')] bg-cover bg-center"
				aria-hidden="true"
			/>
			<div
				className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/55 to-[#6e101e]/70"
				aria-hidden="true"
			/>

			<header className="relative z-10">
				<div className="mx-auto max-w-7xl px-5 pt-5 sm:px-8 lg:px-10">
					<LoginHeader />
				</div>
			</header>

			<main className="relative z-10 flex flex-1 items-center">
				<div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 md:py-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 lg:px-10">
					<div className="max-w-2xl text-white">
						<p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/75 sm:text-sm">
							UBA Digital Resource Hub
						</p>
						<h1 className="font-['Manrope'] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
							Spend less time
							<br />
							<span className="text-white/70">looking. Do more.</span>
						</h1>
						<p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
							Your trusted starting point for the tools, services, and guidance
							that keep work moving.
						</p>
					</div>

					<div className="w-full rounded-2xl border border-white/40 bg-white/95 px-6 py-7 shadow-2xl shadow-black/25 backdrop-blur-xl sm:px-8 sm:py-9">
						<Login />
					</div>
				</div>
			</main>

			<footer className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-5 sm:px-8 lg:px-10">
				<LoginFooter />
			</footer>
		</div>
	);
}

export default SignIn;

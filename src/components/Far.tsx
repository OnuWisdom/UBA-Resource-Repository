import Card from './Card';

const cardData = [
	{
		id: 1,
		title: 'HR Management System',
		subtitle: 'Platform',
		body: 'Employee management and HR related activities including leave,... ',
		dept: 'Human Resources',
		role: 'Employee Services',
		linkTo: '/platforms',
	},
	{
		id: 2,
		title: 'Access request portal ',
		subtitle: 'Portal',
		body: 'Request access to internal systems applications and resources.',
		dept: 'Information technology',
		role: 'Access and Security',
		linkTo: '/applications',
	},
	{
		id: 3,
		title: 'Leave Request Form',
		subtitle: 'Form',
		body: 'Submit and track leave requests for approval',
		dept: 'Human Resources',
		role: 'Requests',
		linkTo: '/services',
	},
	{
		id: 4,
		title: 'Expense Reimbursements',
		subtitle: 'Form',
		body: 'submit expense claims for reimbursements and approval.',
		dept: 'Finance',
		role: 'Requests',
		linkTo: '/services',
	},
	{
		id: 5,
		title: 'Learning Platforms',
		subtitle: 'Platform',
		body: 'Access trainings , courses and professional development resources.',
		dept: 'Human Resources',
		role: 'Learning',
		linkTo: '/services',
	},
	{
		id: 6,
		title: 'Performance Platform',
		subtitle: 'Platform',
		body: 'Manage Employee performance and development.',
		dept: 'Human Resources',
		role: 'Performance',
		linkTo: '/services',
	},
	{
		id: 7,
		title: 'IT Service Desk',
		subtitle: 'Service',
		body: 'submit support requests for IT services and assistance.',
		dept: 'Information Technology',
		role: 'Support',
		linkTo: '/services',
	},
	{
		id: 8,
		title: 'New Employee Onboarding',
		subtitle: 'Guide',
		body: 'Everything new employee need to get started at UBA.',
		dept: 'Human Resources',
		role: 'Employee services',
		linkTo: '/services',
	},
];

function Far() {
	return (
		<div className="flex flex-col">
			<h1 className="font-bold text-xl text-center p-4 bg-slate-50">
				Frequently Used Resources
			</h1>
			<div className="flex items-center m-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-6xl mx-auto">
					{cardData.map((card) => (
						<Card
							key={card.id}
							title={card.title}
							subtitle={card.subtitle}
							body={card.body}
							linkTo={card.linkTo}
							dept={card.dept}
							role={card.role}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default Far;

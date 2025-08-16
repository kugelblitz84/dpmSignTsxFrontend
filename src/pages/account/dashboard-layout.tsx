import { Link } from "react-router-dom";
import routes from "@/routes";
import { ReactNode } from "react"; // Import ReactNode for typing children
import { useAuth } from "@/hooks/use-auth";

// Define the type for a sidebar navigation item
interface SidebarNavItem {
	title: string;
	path: string;
	onClick?: () => void;
}

// Define the type for the DashboardLayout props
interface DashboardLayoutProps {
	children: ReactNode; // ReactNode is used for typing children
	currentPath: string;
}

const DashboardLayout = ({ children, currentPath }: DashboardLayoutProps) => {
	const title =
		currentPath === routes.account.orders.path
			? "Orders"
			: currentPath === routes.account.accountDetails.path
			? "Account Details"
			: "Dashboard";

	const { logout } = useAuth();

	const sidebarNavItems: SidebarNavItem[] = [
		{
			title: "Dashboard",
			path: routes.account.dashboard.path,
		},
		{
			title: "Orders",
			path: routes.account.orders.path,
		},
		{
			title: "Account Details",
			path: routes.account.accountDetails.path,
		},
		{
			title: "Logout",
			path: routes.account.path,
			onClick: logout,
		},
	];

	return (
		<section className="py-2 pb-40">
			{/* Header */}
			<div className="row py-6">
				<h2 className="text-2xl lg:text-3xl font-semibold text-center md:text-left">
					{title}
				</h2>
			</div>
			{/* Left Sidebar */}
			<div className="row grid grid-cols-1 md:grid-cols-6 md:grid-rows-1 gap-6">
				<div className="md:col-span-1 border-gray/30 border-2rem rounded-md p-4 flex items-center justify-start md:items-start md:justify-start flex-col gap-4 min-h">
					{sidebarNavItems.map((item, index) => (
						<Link key={index} to={item.path} onClick={item.onClick}>
							<h3
								className={
									currentPath === item.path
										? "text-base lg:text-xl font-semibold text-skyblue"
										: "text-base lg:text-xl font-normal transition-all duration-300 hover:text-skyblue"
								}
							>
								{item.title}
							</h3>
						</Link>
					))}
				</div>

				<div className="md:col-span-5">{children}</div>
			</div>
		</section>
	);
};

export default DashboardLayout;

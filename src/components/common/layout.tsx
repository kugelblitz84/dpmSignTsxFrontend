import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/common/footer";
import Navigation from "@/components/common/navigation";
import TopBar from "@/components/common/top-bar";
import DashboardLayout from "@/pages/account/dashboard-layout";
import routes, { Routes } from "@/routes";
import { useEffect } from "react";
import { updateMetaDescription } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import Preloader from "@/components/common/preloader";
import ProductProvider from "@/hooks/use-product";
import CategoryProvider from "@/hooks/use-category";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	const location = useLocation();
	const { loading, token, customer } = useAuth();

	// Update meta tags when the location changes
	useEffect(() => {
		const updateMetaTags = (routesObj: Routes) => {
			for (const key in routesObj) {
				const route = routesObj[key];
				if (route.path === location.pathname) {
					document.title = route.title; // Update title
					updateMetaDescription(route.description); // Update meta description
					return;
				}

				if (typeof route === "object" && !Array.isArray(route)) {
					updateMetaTags(route);
				}
			}
		};

		updateMetaTags(routes);
	}, [location]);

	// Update meta tags on initial render
	useEffect(() => {
		const updateMetaTags = (routesObj: Routes) => {
			for (const key in routesObj) {
				const route = routesObj[key];
				if (route.path === location.pathname) {
					document.title = route.title; // Update title
					updateMetaDescription(route.description); // Update meta description
					return;
				}

				if (typeof route === "object" && !Array.isArray(route)) {
					updateMetaTags(route);
				}
			}
		};

		updateMetaTags(routes);
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return (
		<div>
			{loading ? (
				<Preloader />
			) : (
				<>
					<TopBar />
					<ProductProvider>
						<CategoryProvider>
							<Navigation />
						</CategoryProvider>
					</ProductProvider>
					{token && customer && location.pathname.includes("/account") ? (
						<DashboardLayout currentPath={location.pathname}>
							{children}
						</DashboardLayout>
					) : (
						<>{children}</>
					)}
					<Toaster />
					<Footer />
				</>
			)}
		</div>
	);
};

export default Layout;

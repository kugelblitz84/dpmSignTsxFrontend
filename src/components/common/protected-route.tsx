import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import routes from "@/routes";
import Preloader from "@/components/common/preloader";

interface ProtectedRouteProps {
	isPublic?: boolean; // If true, the route is public (e.g., login page)
	redirectPath: string; // Path to redirect to if the condition is not met
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	isPublic = false,
	redirectPath,
	children,
}) => {
	const { loading, token, customer, navigateTo } = useAuth();

	// Wait for loading to complete
	if (loading) {
		return <Preloader />; // Or return a loading spinner
	}

	// If the route is public and the user is authenticated, redirect them
	if (isPublic && token && customer) {
		return <Navigate to={navigateTo ? navigateTo : redirectPath} replace />;
	}

	if (isPublic && !token) {
		return <>{children}</>;
	}

	// If the route is not public and the user is not authenticated, redirect them
	if (!isPublic && !token) {
		return <Navigate to={routes.account.path} replace />;
	}

	// Otherwise, render the route
	// return <Outlet />;
	return <>{children}</>;
};

export default ProtectedRoute;

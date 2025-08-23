/** @format */

import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredRole?: "admin" | "manager" | "user";
	allowedRoles?: ("admin" | "manager" | "user")[];
	redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	requiredRole,
	allowedRoles,
	redirectTo = "/auth",
}) => {
	const { isAuthenticated, user, isLoading } = useAuth();
	const location = useLocation();

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	// If not authenticated, redirect to auth page
	if (!isAuthenticated) {
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}

	// If role is required, check if user has the required role
	if (requiredRole && user?.role?.key !== requiredRole) {
		// Redirect based on user's actual role
		if (user?.role?.key === "admin") {
			return <Navigate to='/admin' replace />;
		} else if (user?.role?.key === "manager") {
			return <Navigate to='/manager' replace />;
		}
		return <Navigate to='/' replace />;
	}

	// If allowedRoles is specified, check if user has any of the allowed roles
	if (allowedRoles && !allowedRoles.includes(user?.role?.key as any)) {
		// Redirect based on user's actual role
		if (user?.role?.key === "admin") {
			return <Navigate to='/admin' replace />;
		} else if (user?.role?.key === "manager") {
			return <Navigate to='/manager' replace />;
		}
		return <Navigate to='/' replace />;
	}

	return <>{children}</>;
};

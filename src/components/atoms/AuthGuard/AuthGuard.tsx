/** @format */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

interface AuthGuardProps {
	children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
	const { isAuthenticated, user, isLoading } = useAuth();

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	// If authenticated, redirect based on user role
	if (isAuthenticated) {
		if (user?.role?.key === "admin") {
			return <Navigate to="/admin" replace />;
		} else if (user?.role?.key === "manager") {
			return <Navigate to="/manager" replace />;
		} else {
			return <Navigate to="/" replace />;
		}
	}

	// If not authenticated, show the auth page
	return <>{children}</>;
};

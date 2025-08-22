/** @format */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

interface ProtectedRouteProps {
	children: React.ReactNode;
	redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	redirectTo = "/auth",
}) => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='flex flex-col items-center space-y-4'>
					<div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
					<p className='text-gray-600 dark:text-gray-400'>Loading...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		// Redirect to auth page, but save the attempted location
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}

	return <>{children}</>;
};

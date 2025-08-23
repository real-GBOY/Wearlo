/** @format */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export const DashboardRedirect: React.FC = () => {
	const { user, isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading) {
			console.log("DashboardRedirect - Auth state:", {
				isAuthenticated,
				userRole: user?.role?.key,
				userName: user?.name,
			});

			if (!isAuthenticated) {
				console.log(
					"DashboardRedirect - Not authenticated, redirecting to home"
				);
				navigate("/", { replace: true });
			} else if (user?.role?.key === "admin") {
				console.log("DashboardRedirect - Admin user, redirecting to /admin");
				navigate("/admin", { replace: true });
			} else if (user?.role?.key === "manager") {
				console.log(
					"DashboardRedirect - Manager user, redirecting to /manager"
				);
				navigate("/manager", { replace: true });
			} else {
				console.log("DashboardRedirect - Regular user, redirecting to home");
				navigate("/", { replace: true });
			}
		}
	}, [isLoading, isAuthenticated, user, navigate]);

	// Show loading state while redirecting
	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			<p className='mt-4 text-gray-600'>Redirecting to dashboard...</p>
		</div>
	);
};

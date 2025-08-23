/** @format */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardTemplate from "../../components/templates/DashboardTemplate/DashboardTemplate";
import DashboardOverviewScreen from "../DashboardOverviewScreen";
import ProductManagementScreen from "../ProductManagementScreen";
import CategoryManagementScreen from "../CategoryManagementScreen";
import { useAuth } from "../../contexts/AuthContext";

const AdminDashboardScreen: React.FC = () => {
	const { isLoading, user } = useAuth();

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600 dark:text-gray-400'>
						Loading dashboard...
					</p>
				</div>
			</div>
		);
	}

	// Show welcome message
	if (user) {
		console.log("User accessing dashboard:", {
			name: user.name,
			role: user.role?.key,
			permissions: user.role?.permissions?.map((p: any) => p.key),
		});
	}

	return (
		<DashboardTemplate>
			<Routes>
				<Route path='/' element={<DashboardOverviewScreen />} />
				<Route path='/products' element={<ProductManagementScreen />} />
				<Route path='/categories' element={<CategoryManagementScreen />} />
				<Route
					path='/orders'
					element={<div>Orders Management - Coming Soon</div>}
				/>
				<Route
					path='/users'
					element={<div>User Management - Coming Soon</div>}
				/>
				<Route path='/analytics' element={<div>Analytics - Coming Soon</div>} />
				<Route path='/settings' element={<div>Settings - Coming Soon</div>} />
				<Route path='*' element={<Navigate to='/admin' replace />} />
			</Routes>
		</DashboardTemplate>
	);
};

export default AdminDashboardScreen;

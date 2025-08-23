/** @format */

import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PageTemplate } from "./components/templates/PageTemplate/PageTemplate";
import {
	LandingScreen,
	ProductDetailsScreen,
	AuthScreen,
	NotFoundScreen,
} from "./screens";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import { ProtectedRoute, DashboardRedirect, AuthGuard } from "./components";

// Create a client
const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<Router>
					<AuthProvider>
						<Routes>
							<Route
								path='/'
								element={
									<PageTemplate>
										<LandingScreen />
									</PageTemplate>
								}
							/>
							<Route
								path='/product/:id'
								element={
									<PageTemplate>
										<ProductDetailsScreen />
									</PageTemplate>
								}
							/>
							<Route
								path='/auth'
								element={
									<AuthGuard>
										<AuthScreen />
									</AuthGuard>
								}
							/>
							<Route path='/login' element={<Navigate to='/auth' replace />} />
							<Route path='/signup' element={<Navigate to='/auth' replace />} />
							<Route path='/dashboard' element={<DashboardRedirect />} />
							<Route
								path='/admin/*'
								element={
									<ProtectedRoute allowedRoles={["admin", "manager"]}>
										<AdminDashboardScreen />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/manager/*'
								element={
									<ProtectedRoute allowedRoles={["admin", "manager"]}>
										<AdminDashboardScreen />
									</ProtectedRoute>
								}
							/>
							{/* 404 - Catch all unmatched routes */}
							<Route path='*' element={<NotFoundScreen />} />
						</Routes>
					</AuthProvider>
				</Router>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;

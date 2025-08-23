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
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Toaster } from "react-hot-toast";
import { PageTemplate } from "./components/templates/PageTemplate/PageTemplate";
import {
	LandingScreen,
	ProductDetailsScreen,
	NotFoundScreen,
	ProductsScreen,
	UserProfileScreen,
	CheckoutScreen,
} from "./screens";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import { ProtectedRoute, DashboardRedirect, AuthGuard } from "./components";

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes
			retry: (failureCount, error: any) => {
				// Don't retry on 4xx errors (client errors)
				if (error?.response?.status >= 400 && error?.response?.status < 500) {
					return false;
				}
				// Retry up to 3 times for other errors
				return failureCount < 3;
			},
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
		mutations: {
			retry: (failureCount, error: any) => {
				// Don't retry mutations on 4xx errors
				if (error?.response?.status >= 400 && error?.response?.status < 500) {
					return false;
				}
				// Retry up to 2 times for other errors
				return failureCount < 2;
			},
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<Router>
					<AuthProvider>
						<CartProvider>
							<WishlistProvider>
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
										path='/products'
										element={
											<PageTemplate>
												<ProductsScreen />
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
									<Route path='/login' element={<Navigate to='/' replace />} />
									<Route path='/signup' element={<Navigate to='/' replace />} />
									<Route path='/dashboard' element={<DashboardRedirect />} />
									<Route
										path='/profile'
										element={
											<ProtectedRoute
												allowedRoles={["admin", "manager", "user"]}>
												<PageTemplate>
													<UserProfileScreen />
												</PageTemplate>
											</ProtectedRoute>
										}
									/>
									<Route
										path='/checkout'
										element={
											<ProtectedRoute
												allowedRoles={["admin", "manager", "user"]}>
												<PageTemplate>
													<CheckoutScreen />
												</PageTemplate>
											</ProtectedRoute>
										}
									/>
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
								<Toaster
									position='top-right'
									toastOptions={{
										duration: 4000,
										style: {
											background: "#363636",
											color: "#fff",
										},
									}}
								/>
							</WishlistProvider>
						</CartProvider>
					</AuthProvider>
				</Router>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;

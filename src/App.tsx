/** @format */

import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Toaster } from "react-hot-toast";
import { PageTemplate } from "./components/templates/PageTemplate/PageTemplate";
import { StripeProvider } from "./components/providers/StripeProvider";
import {
	LandingScreen,
	ProductDetailsScreen,
	NotFoundScreen,
	ProductsScreen,
	CategoriesScreen,
	UserProfileScreen,
	CheckoutScreen,
	SuccessScreen,
	CancelScreen,
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
			<Router>
				<AuthProvider>
					<CartProvider>
						<WishlistProvider>
							<StripeProvider>
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
									path='/categories'
									element={
										<PageTemplate>
											<CategoriesScreen />
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
										<ProtectedRoute allowedRoles={["admin", "manager", "user"]}>
											<PageTemplate>
												<UserProfileScreen />
											</PageTemplate>
										</ProtectedRoute>
									}
								/>
								<Route
									path='/checkout'
									element={
										<ProtectedRoute allowedRoles={["admin", "manager", "user"]}>
											<PageTemplate>
												<CheckoutScreen />
											</PageTemplate>
										</ProtectedRoute>
									}
								/>
								<Route path='/success' element={<SuccessScreen />} />
								<Route path='/cancel' element={<CancelScreen />} />
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
							</StripeProvider>
							<Toaster
								position='top-right'
								toastOptions={{
									duration: 4000,
									style: {
										background: "#ffffff",
										color: "#374151",
									},
								}}
							/>
						</WishlistProvider>
					</CartProvider>
				</AuthProvider>
			</Router>
		</QueryClientProvider>
	);
}

export default App;

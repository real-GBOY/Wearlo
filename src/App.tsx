/** @format */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PageTemplate } from "./components/templates/PageTemplate/PageTemplate";
import { LandingScreen, ProductDetailsScreen, AuthScreen } from "./screens";

// Create a client
const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<AuthProvider>
					<Router>
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
							<Route path='/auth' element={<AuthScreen />} />
						</Routes>
					</Router>
				</AuthProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;

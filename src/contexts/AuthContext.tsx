/** @format */

import { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiRepo from "../../config/apiRepo";
import endPoints from "../../config/endPoints";
import Cookies from "js-cookie";
import { useEffect } from "react";

interface Permission {
	_id: string;
	key: string;
}

interface User {
	id: string;
	name: string;
	email: string;
	phone?: string;
	address?: string;
	city?: string;
	zip?: string;
	country?: string;
	role: {
		_id: string;
		key: string;
		permissions: Permission[];
	};
	profilePicture?: string;
}

interface LoginResponse {
	token: string;
	refreshToken: string;
	user: User;
}

interface SignupResponse {
	token: string;
	refreshToken: string;
	user: User;
}

interface AuthContextType {
	token: string | null;
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	signup: (
		name: string,
		email: string,
		password: string,
		phone: string,
		address: string,
		city: string,
		zip: string,
		country: string
	) => Promise<void>;
	setAuthData: (token: string, user: User) => void;
	logout: () => void;
	loginMutation: ReturnType<
		typeof useMutation<
			LoginResponse,
			Error,
			{ email: string; password: string }
		>
	>;
	signupMutation: ReturnType<
		typeof useMutation<
			SignupResponse,
			Error,
			{
				name: string;
				email: string;
				password: string;
				phone: string;
				address: string;
				city: string;
				zip: string;
				country: string;
			}
		>
	>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = Cookies.get("token");
		const user = Cookies.get("user");

		console.log("AuthContext useEffect:", { token: !!token, user: !!user });

		if (token && user) {
			try {
				const parsedUser = JSON.parse(user);
				console.log("Parsed user data:", {
					name: parsedUser.name,
					role: parsedUser.role?.key,
					permissions: parsedUser.role?.permissions?.map(
						(p: Permission) => p.key
					),
				});
				setToken(token);
				setUser(parsedUser);
				setIsAuthenticated(true);
			} catch (error) {
				console.error("Error parsing user data from cookie:", error);
				// Clear invalid cookies
				Cookies.remove("token");
				Cookies.remove("user");
			}
		}

		setIsLoading(false);
	}, []);

	const loginMutation = useMutation<
		any,
		Error,
		{ email: string; password: string }
	>({
		mutationFn: async ({ email, password }) => {
			console.log("Making API call to login endpoint");
			try {
				const response = await apiRepo.POST(endPoints.auth.login, {
					email,
					password,
				});
				console.log("API response received:", response);
				console.log("Response type:", typeof response);
				console.log("Response keys:", Object.keys(response));

				// Validate that the response has the expected structure
				if (response && typeof response === "object") {
					console.log("Response validation passed");

					// Check if the response has the expected structure
					if (response.success !== undefined) {
						console.log("Response has success field:", response.success);
					}
					if (response.data !== undefined) {
						console.log("Response has data field:", !!response.data);
					}
				} else {
					console.error(
						"Response validation failed - unexpected response type"
					);
				}

				return response;
			} catch (error) {
				console.error("API call error:", error);
				throw error;
			}
		},
		onSuccess: (data: any) => {
			console.log("Login response received:", data);
			console.log("Response structure validation:");
			console.log("- data.token exists:", !!data.token);
			console.log("- data.refreshToken exists:", !!data.refreshToken);
			console.log("- data.user exists:", !!data.user);

			try {
				// Handle different possible response structures
				let accessToken, user;

				if (data.token && data.user) {
					// Expected structure: { token, refreshToken, user }
					accessToken = data.token;
					user = data.user;
				} else if (data.success === false) {
					throw new Error(`Login failed: ${data.message || "Unknown error"}`);
				} else {
					throw new Error(
						"Invalid response structure: missing token or user data"
					);
				}

				console.log("Login success - user data:", {
					name: user.name,
					role: user.role?.key,
					permissions: user.role?.permissions?.map((p: Permission) => p.key),
				});

				// Set cookies with proper options for persistence
				Cookies.set("token", accessToken, { expires: 7 }); // Expires in 7 days
				Cookies.set("user", JSON.stringify(user), { expires: 7 }); // Expires in 7 days

				setToken(accessToken);
				setUser(user);
				setIsAuthenticated(true);
			} catch (error) {
				console.error("Error processing login response:", error);
				console.error("Response data:", data);
				// Clear any existing auth data on error
				setToken(null);
				setUser(null);
				setIsAuthenticated(false);
				Cookies.remove("token");
				Cookies.remove("user");
			}
		},
		onError: (error: any) => {
			console.error("Login error:", error);
			console.error("Login error details:", {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			});
			// Clear any existing auth data on error
			setToken(null);
			setUser(null);
			setIsAuthenticated(false);
			Cookies.remove("token");
			Cookies.remove("user");
		},
	});

	const signupMutation = useMutation<
		any,
		Error,
		{
			name: string;
			email: string;
			password: string;
			phone: string;
			address: string;
			city: string;
			zip: string;
			country: string;
		}
	>({
		mutationFn: async ({
			name,
			email,
			password,
			phone,
			address,
			city,
			zip,
			country,
		}) => {
			console.log("Making API call to signup endpoint");
			try {
				const response = await apiRepo.POST(endPoints.auth.register, {
					name,
					email,
					password,
					phone,
					address,
					city,
					zip,
					country,
				});
				console.log("Signup API response received:", response);
				return response;
			} catch (error) {
				console.error("Signup API call error:", error);
				throw error;
			}
		},
		onSuccess: (data: any) => {
			console.log("Signup response received:", data);
			console.log("Response structure validation:");
			console.log("- data.token exists:", !!data.token);
			console.log("- data.refreshToken exists:", !!data.refreshToken);
			console.log("- data.user exists:", !!data.user);

			try {
				// Handle different possible response structures
				let accessToken, user;

				if (data.token && data.user) {
					// Expected structure: { token, refreshToken, user }
					accessToken = data.token;
					user = data.user;
				} else if (data.success === false) {
					throw new Error(`Signup failed: ${data.message || "Unknown error"}`);
				} else {
					throw new Error(
						"Invalid response structure: missing token or user data"
					);
				}

				console.log("Signup success - user data:", {
					name: user.name,
					role: user.role?.key,
					permissions: user.role?.permissions?.map((p: Permission) => p.key),
				});

				// Set cookies with proper options for persistence
				Cookies.set("token", accessToken, { expires: 7 }); // Expires in 7 days
				Cookies.set("user", JSON.stringify(user), { expires: 7 }); // Expires in 7 days

				setToken(accessToken);
				setUser(user);
				setIsAuthenticated(true);
			} catch (error) {
				console.error("Error processing signup response:", error);
				console.error("Response data:", data);
				// Clear any existing auth data on error
				setToken(null);
				setUser(null);
				setIsAuthenticated(false);
				Cookies.remove("token");
				Cookies.remove("user");
			}
		},
		onError: (error: any) => {
			console.error("Signup error:", error);
			console.error("Signup error details:", {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			});
			// Clear any existing auth data on error
			setToken(null);
			setUser(null);
			setIsAuthenticated(false);
			Cookies.remove("token");
			Cookies.remove("user");
		},
	});

	const login = async (email: string, password: string) => {
		console.log("Login function called with:", { email });
		try {
			const result = await loginMutation.mutateAsync({ email, password });
			console.log("Login mutation result:", result);
		} catch (error) {
			console.error("Login function error:", error);
			throw error;
		}
	};

	const signup = async (
		name: string,
		email: string,
		password: string,
		phone: string,
		address: string,
		city: string,
		zip: string,
		country: string
	) => {
		console.log("Signup function called with:", {
			name,
			email,
			password,
			phone,
			address,
			city,
			zip,
			country,
		});
		try {
			const result = await signupMutation.mutateAsync({
				name,
				email,
				password,
				phone,
				address,
				city,
				zip,
				country,
			});
			console.log("Signup mutation result:", result);
		} catch (error) {
			console.error("Signup function error:", error);
			throw error;
		}
	};

	const setAuthData = (token: string, user: User) => {
		setToken(token);
		setUser(user);
		setIsAuthenticated(true);
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		setIsAuthenticated(false);
		Cookies.remove("token");
		Cookies.remove("user");
	};

	return (
		<AuthContext.Provider
			value={{
				token,
				user,
				isAuthenticated,
				isLoading,
				login,
				signup,
				setAuthData,
				logout,
				loginMutation,
				signupMutation,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider, useAuth };

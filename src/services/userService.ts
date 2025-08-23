/** @format */

import apiRepo from "../../config/apiRepo";
import { User } from "../types";

export interface UserFilters {
	role?: string;
	status?: string;
	search?: string;
	page?: number;
	limit?: number;
}

export interface UserResponse {
	users: User[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface UpdateUserStatusRequest {
	userId: string;
	status: "active" | "inactive" | "suspended";
}

export interface UpdateUserRoleRequest {
	userId: string;
	role: "admin" | "customer" | "moderator";
}

class UserService {
	/**
	 * Get all users with optional filtering and pagination
	 */
	async getUsers(filters: UserFilters = {}): Promise<UserResponse> {
		try {
			const queryParams = new URLSearchParams();

			if (filters.role) queryParams.append("role", filters.role);
			if (filters.status) queryParams.append("status", filters.status);
			if (filters.search) queryParams.append("search", filters.search);
			if (filters.page) queryParams.append("page", filters.page.toString());
			if (filters.limit) queryParams.append("limit", filters.limit.toString());

			const response = await apiRepo.GET(`/users?${queryParams.toString()}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching users:", error);
			throw new Error("Failed to fetch users");
		}
	}

	/**
	 * Get a single user by ID
	 */
	async getUserById(userId: string): Promise<User> {
		try {
			const response = await apiRepo.GET(`/users/${userId}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching user:", error);
			throw new Error("Failed to fetch user");
		}
	}

	/**
	 * Update user status
	 */
	async updateUserStatus(data: UpdateUserStatusRequest): Promise<User> {
		try {
			const response = await apiRepo.PATCH(`/users/${data.userId}/status`, {
				status: data.status,
			});
			return response.data;
		} catch (error) {
			console.error("Error updating user status:", error);
			throw new Error("Failed to update user status");
		}
	}

	/**
	 * Update user role
	 */
	async updateUserRole(data: UpdateUserRoleRequest): Promise<User> {
		try {
			const response = await apiRepo.PATCH(`/users/${data.userId}/role`, {
				role: data.role,
			});
			return response.data;
		} catch (error) {
			console.error("Error updating user role:", error);
			throw new Error("Failed to update user role");
		}
	}

	/**
	 * Delete a user
	 */
	async deleteUser(userId: string): Promise<void> {
		try {
			await apiRepo.DELETE(`/users/${userId}`);
		} catch (error) {
			console.error("Error deleting user:", error);
			throw new Error("Failed to delete user");
		}
	}

	/**
	 * Get user statistics
	 */
	async getUserStats(): Promise<{
		totalUsers: number;
		activeUsers: number;
		inactiveUsers: number;
		suspendedUsers: number;
		customers: number;
		admins: number;
		moderators: number;
	}> {
		try {
			const response = await apiRepo.GET("/users/stats");
			return response.data;
		} catch (error) {
			console.error("Error fetching user stats:", error);
			throw new Error("Failed to fetch user statistics");
		}
	}
}

export const userService = new UserService();
export default userService;

/** @format */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	userService,
	UserFilters,
	UpdateUserStatusRequest,
	UpdateUserRoleRequest,
} from "../services/userService";
import { toast } from "react-hot-toast";

export const useUsers = (filters: UserFilters = {}) => {
	const [currentFilters, setCurrentFilters] = useState<UserFilters>(filters);
	const queryClient = useQueryClient();

	// Fetch users with filters
	const {
		data: usersData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["users", currentFilters],
		queryFn: () => userService.getUsers(currentFilters),
		keepPreviousData: true,
	});

	// Fetch user statistics
	const {
		data: userStats,
		isLoading: statsLoading,
		error: statsError,
	} = useQuery({
		queryKey: ["userStats"],
		queryFn: () => userService.getUserStats(),
	});

	// Update user status mutation
	const updateStatusMutation = useMutation({
		mutationFn: (data: UpdateUserStatusRequest) =>
			userService.updateUserStatus(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["userStats"] });
			toast.success("User status updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update user status");
		},
	});

	// Update user role mutation
	const updateRoleMutation = useMutation({
		mutationFn: (data: UpdateUserRoleRequest) =>
			userService.updateUserRole(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["userStats"] });
			toast.success("User role updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update user role");
		},
	});

	// Delete user mutation
	const deleteUserMutation = useMutation({
		mutationFn: (userId: string) => userService.deleteUser(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["userStats"] });
			toast.success("User deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete user");
		},
	});

	// Update filters
	const updateFilters = (newFilters: Partial<UserFilters>) => {
		setCurrentFilters((prev) => ({ ...prev, ...newFilters }));
	};

	// Reset filters
	const resetFilters = () => {
		setCurrentFilters(filters);
	};

	return {
		// Data
		users: usersData?.users || [],
		total: usersData?.total || 0,
		page: usersData?.page || 1,
		limit: usersData?.limit || 10,
		totalPages: usersData?.totalPages || 0,
		userStats,

		// Loading states
		isLoading,
		statsLoading,

		// Errors
		error,
		statsError,

		// Filters
		currentFilters,
		updateFilters,
		resetFilters,

		// Mutations
		updateStatus: updateStatusMutation.mutate,
		updateRole: updateRoleMutation.mutate,
		deleteUser: deleteUserMutation.mutate,
		isUpdatingStatus: updateStatusMutation.isLoading,
		isUpdatingRole: updateRoleMutation.isLoading,
		isDeleting: deleteUserMutation.isLoading,

		// Utils
		refetch,
	};
};

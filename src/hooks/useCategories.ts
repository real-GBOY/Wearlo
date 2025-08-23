/** @format */

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";

export const useCategories = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () => categoryService.getAll(),
		staleTime: 10 * 60 * 1000, // 10 minutes
		gcTime: 15 * 60 * 1000, // 15 minutes
	});
};

export const useCategory = (id: string) => {
	return useQuery({
		queryKey: ["category", id],
		queryFn: () => categoryService.getById(id),
		enabled: !!id,
		staleTime: 10 * 60 * 1000, // 10 minutes
		gcTime: 15 * 60 * 1000, // 15 minutes
	});
};

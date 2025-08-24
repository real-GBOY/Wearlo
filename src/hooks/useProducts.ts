/** @format */

import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export const useProducts = (page: number = 1, limit: number = 50) => {
	return useQuery({
		queryKey: ["products", page, limit],
		queryFn: () => productService.getAll(page, limit),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const useProduct = (id: string) => {
	return useQuery({
		queryKey: ["product", id],
		queryFn: () => productService.getById(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

export const useRelatedProducts = (
	categoryId: string,
	currentProductId: string,
	limit: number = 4
) => {
	return useQuery({
		queryKey: ["relatedProducts", categoryId, currentProductId, limit],
		queryFn: () =>
			productService.getRelatedByCategory(categoryId, currentProductId, limit),
		enabled: !!categoryId && !!currentProductId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

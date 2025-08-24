/** @format */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Package, DollarSign, Tag, AlertTriangle } from "lucide-react";
import { Product, ProductSize } from "../../../types";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import Select from "../../atoms/Select";
import { categoryService, Category } from "../../../services/categoryService";
import { productService } from "../../../services/productService";

interface ProductEditModalProps {
	product: Product | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (updatedProduct: Product) => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
	product,
	isOpen,
	onClose,
	onSave,
}) => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: 0,
		discount: 0,
		stock: 0,
		category: "",
	});
	const [sizes, setSizes] = useState<ProductSize[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name,
				description: product.description,
				price: product.price,
				discount: product.discount || 0,
				stock: product.stock,
				category: product.category as string,
			});
			setSizes([...product.sizes]);
		}
	}, [product]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const categoriesData = await categoryService.getAll();
				setCategories(categoriesData);
			} catch (error) {
				console.error("Failed to fetch categories:", error);
			}
		};

		if (isOpen) {
			fetchCategories();
		}
	}, [isOpen]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Product name is required";
		}
		if (!formData.description.trim()) {
			newErrors.description = "Description is required";
		}
		if (formData.price <= 0) {
			newErrors.price = "Price must be greater than 0";
		}
		if (formData.stock < 0) {
			newErrors.stock = "Stock cannot be negative";
		}
		if (formData.discount < 0 || formData.discount > 100) {
			newErrors.discount = "Discount must be between 0 and 100";
		}
		if (!formData.category) {
			newErrors.category = "Category is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm() || !product) return;

		setLoading(true);
		try {
			const updateData = {
				name: formData.name,
				description: formData.description,
				price: formData.price,
				discount: formData.discount,
				stock: formData.stock,
				category: formData.category,
				sizes: sizes,
			};

			const updatedProduct = await productService.updateBasic(
				product.id,
				updateData
			);
			onSave(updatedProduct);
			onClose();
		} catch (error) {
			console.error("Failed to update product:", error);
			setErrors({ submit: "Failed to update product. Please try again." });
		} finally {
			setLoading(false);
		}
	};

	const handleSizeChange = (
		index: number,
		field: keyof ProductSize,
		value: string | number
	) => {
		const newSizes = [...sizes];
		newSizes[index] = { ...newSizes[index], [field]: value };
		setSizes(newSizes);
	};

	const addSize = () => {
		setSizes([...sizes, { label: "", stock: 0 }]);
	};

	const removeSize = (index: number) => {
		setSizes(sizes.filter((_, i) => i !== index));
	};

	if (!product) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'
					onClick={onClose}>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
						onClick={(e) => e.stopPropagation()}>
						{/* Header */}
						<div className='flex items-center justify-between p-6 border-b border-gray-200'>
							<h2 className='text-2xl font-bold text-gray-900 flex items-center'>
								<Package className='h-5 w-5 mr-2' />
								Edit Product
							</h2>
							<button
								onClick={onClose}
								className='p-2 rounded-lg hover:bg-gray-100 transition-colors'>
								<X className='h-6 w-6 text-gray-500' />
							</button>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className='p-6 space-y-6'>
							{/* Basic Information */}
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold text-gray-900'>
									Basic Information
								</h3>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<Input
											label='Product Name'
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											error={errors.name}
											required
										/>
									</div>
									<div>
										<Select
											label='Category'
											value={formData.category}
											onChange={(value) =>
												setFormData({ ...formData, category: value })
											}
											error={errors.category}
											options={[
												{ value: "", label: "Select a category" },
												...categories.map((category) => ({
													value: category._id,
													label: category.name,
												})),
											]}
										/>
									</div>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Description
									</label>
									<textarea
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										rows={3}
										className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
										required
									/>
									{errors.description && (
										<p className='mt-1 text-sm text-red-600'>
											{errors.description}
										</p>
									)}
								</div>
							</div>

							{/* Pricing & Stock */}
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold text-gray-900 flex items-center'>
									<DollarSign className='h-5 w-5 mr-2' />
									Pricing & Stock
								</h3>

								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									<div>
										<Input
											label='Price ($)'
											type='number'
											step='0.01'
											min='0'
											value={formData.price}
											onChange={(e) =>
												setFormData({
													...formData,
													price: parseFloat(e.target.value) || 0,
												})
											}
											error={errors.price}
											required
										/>
									</div>
									<div>
										<Input
											label='Discount (%)'
											type='number'
											min='0'
											max='100'
											value={formData.discount}
											onChange={(e) =>
												setFormData({
													...formData,
													discount: parseInt(e.target.value) || 0,
												})
											}
											error={errors.discount}
										/>
									</div>
									<div>
										<Input
											label='Stock Level'
											type='number'
											min='0'
											value={formData.stock}
											onChange={(e) =>
												setFormData({
													...formData,
													stock: parseInt(e.target.value) || 0,
												})
											}
											error={errors.stock}
											required
										/>
									</div>
								</div>

								{/* Stock Warning */}
								{formData.stock <= 10 && (
									<div className='flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg'>
										<AlertTriangle className='h-5 w-5 text-orange-600' />
										<span className='text-orange-800 text-sm'>
											Low stock warning: {formData.stock} units remaining
										</span>
									</div>
								)}
							</div>

							{/* Sizes */}
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<h3 className='text-lg font-semibold text-gray-900 flex items-center'>
										<Tag className='h-5 w-5 mr-2' />
										Available Sizes
									</h3>
									<Button
										type='button'
										variant='outline'
										size='sm'
										onClick={addSize}
										className='flex items-center space-x-2'>
										<span>Add Size</span>
									</Button>
								</div>

								<div className='space-y-3'>
									{sizes.map((size, index) => (
										<div
											key={index}
											className='flex items-center space-x-3 p-3 border border-gray-200 rounded-lg'>
											<div className='flex-1'>
												<Input
													label='Size Label'
													value={size.label}
													onChange={(e) =>
														handleSizeChange(index, "label", e.target.value)
													}
													placeholder='e.g., S, M, L, XL'
												/>
											</div>
											<div className='flex-1'>
												<Input
													label='Stock'
													type='number'
													min='0'
													value={size.stock}
													onChange={(e) =>
														handleSizeChange(
															index,
															"stock",
															parseInt(e.target.value) || 0
														)
													}
													placeholder='0'
												/>
											</div>
											<button
												type='button'
												onClick={() => removeSize(index)}
												className='p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors'>
												<X className='h-4 w-4' />
											</button>
										</div>
									))}

									{sizes.length === 0 && (
										<div className='text-center py-6 text-gray-500'>
											<p>
												No sizes defined. Click "Add Size" to add size variants.
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Error Message */}
							{errors.submit && (
								<div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
									<p className='text-red-800 text-sm'>{errors.submit}</p>
								</div>
							)}

							{/* Footer */}
							<div className='flex items-center justify-end space-x-3 pt-6 border-t border-gray-200'>
								<Button
									type='button'
									variant='outline'
									onClick={onClose}
									disabled={loading}>
									Cancel
								</Button>
								<Button
									type='submit'
									disabled={loading}
									className='flex items-center space-x-2'>
									<Save className='h-4 w-4' />
									<span>{loading ? "Saving..." : "Save Changes"}</span>
								</Button>
							</div>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ProductEditModal;

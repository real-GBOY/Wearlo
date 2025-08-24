/** @format */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import Select from "../../atoms/Select";
import { Typography } from "../../atoms/Typography";
import { StockUpdateRequest } from "../../../types";

interface StockUpdateModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: StockUpdateRequest) => Promise<void>;
	productName: string;
	currentStock: number;
	sizeLabel?: string;
	loading?: boolean;
}

const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	productName,
	currentStock,
	sizeLabel,
	loading = false,
}) => {
	const [formData, setFormData] = useState<StockUpdateRequest>({
		stock: 0,
		operation: "add",
		reason: "",
		size: sizeLabel,
	});

	const [errors, setErrors] = useState<string[]>([]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors([]);

		// Validation
		const newErrors: string[] = [];
		if (formData.stock < 0) {
			newErrors.push("Stock quantity cannot be negative");
		}
		if (formData.operation === "subtract" && formData.stock > currentStock) {
			newErrors.push("Cannot subtract more than current stock");
		}
		if (!formData.reason.trim()) {
			newErrors.push("Please provide a reason for the stock change");
		}

		if (newErrors.length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			await onSubmit(formData);
			onClose();
		} catch (error) {
			setErrors([
				error instanceof Error ? error.message : "Failed to update stock",
			]);
		}
	};

	const handleInputChange = (field: keyof StockUpdateRequest, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const calculateNewStock = () => {
		switch (formData.operation) {
			case "add":
				return currentStock + formData.stock;
			case "subtract":
				return Math.max(0, currentStock - formData.stock);
			case "set":
				return formData.stock;
			default:
				return currentStock;
		}
	};

	const getOperationDescription = () => {
		switch (formData.operation) {
			case "add":
				return `Add ${formData.stock} to current stock`;
			case "subtract":
				return `Subtract ${formData.stock} from current stock`;
			case "set":
				return `Set stock to ${formData.stock}`;
			default:
				return "";
		}
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<div className='fixed inset-0 z-50 flex items-center justify-center'>
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='absolute inset-0 bg-black bg-opacity-50'
					onClick={onClose}
				/>

				{/* Modal */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					className='relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4'>
					{/* Header */}
					<div className='flex items-center justify-between p-6 border-b border-gray-200'>
						<div className='flex items-center space-x-3'>
							<div className='p-2 bg-blue-100 rounded-lg'>
								<Package className='h-5 w-5 text-blue-600' />
							</div>
							<div>
								<Typography variant='h3' className='text-gray-900'>
									Update Stock
								</Typography>
								<Typography variant='body2' className='text-gray-600'>
									{productName}
									{sizeLabel && ` - Size ${sizeLabel}`}
								</Typography>
							</div>
						</div>
						<button
							onClick={onClose}
							className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
							<X className='h-5 w-5 text-gray-500' />
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className='p-6 space-y-6'>
						{/* Current Stock Display */}
						<div className='bg-gray-50 rounded-lg p-4'>
							<div className='flex items-center justify-between'>
								<Typography variant='body2' className='text-gray-600'>
									Current Stock
								</Typography>
								<Typography
									variant='h4'
									className='font-semibold text-gray-900'>
									{currentStock}
								</Typography>
							</div>
						</div>

						{/* Operation Selection */}
						<div className='space-y-2'>
							<Typography variant='label' className='text-gray-700'>
								Operation Type
							</Typography>
							<Select
								value={formData.operation}
								onChange={(value) =>
									handleInputChange(
										"operation",
										value as "add" | "subtract" | "set"
									)
								}
								options={[
									{ value: "add", label: "Add Stock" },
									{ value: "subtract", label: "Subtract Stock" },
									{ value: "set", label: "Set Stock" },
								]}
							/>
						</div>

						{/* Quantity Input */}
						<div className='space-y-2'>
							<Typography variant='label' className='text-gray-700'>
								Quantity
							</Typography>
							<Input
								type='number'
								value={formData.stock}
								onChange={(e) =>
									handleInputChange("stock", parseInt(e.target.value) || 0)
								}
								placeholder='Enter quantity'
								min='0'
								required
							/>
						</div>

						{/* Reason Input */}
						<div className='space-y-2'>
							<Typography variant='label' className='text-gray-700'>
								Reason
							</Typography>
							<Input
								value={formData.reason}
								onChange={(e) => handleInputChange("reason", e.target.value)}
								placeholder='e.g., Restock, Sale, Return, Adjustment'
								required
							/>
						</div>

						{/* Preview */}
						<div className='bg-blue-50 rounded-lg p-4'>
							<div className='flex items-center space-x-2 mb-2'>
								<CheckCircle className='h-4 w-4 text-blue-600' />
								<Typography
									variant='body2'
									className='text-blue-800 font-medium'>
									Preview
								</Typography>
							</div>
							<Typography variant='body2' className='text-blue-700'>
								{getOperationDescription()}
							</Typography>
							<Typography variant='body2' className='text-blue-700'>
								New stock will be:{" "}
								<span className='font-semibold'>{calculateNewStock()}</span>
							</Typography>
						</div>

						{/* Errors */}
						{errors.length > 0 && (
							<div className='bg-red-50 rounded-lg p-4'>
								<div className='flex items-center space-x-2 mb-2'>
									<AlertTriangle className='h-4 w-4 text-red-600' />
									<Typography
										variant='body2'
										className='text-red-800 font-medium'>
										Please fix the following errors:
									</Typography>
								</div>
								<ul className='list-disc list-inside space-y-1'>
									{errors.map((error, index) => (
										<li key={index} className='text-red-700 text-sm'>
											{error}
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Actions */}
						<div className='flex items-center justify-end space-x-3 pt-4'>
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
								className='min-w-[100px]'>
								{loading ? "Updating..." : "Update Stock"}
							</Button>
						</div>
					</form>
				</motion.div>
			</div>
		</AnimatePresence>
	);
};

export default StockUpdateModal;

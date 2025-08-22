/** @format */

import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	variant?: "default" | "minimal";
	type?: "text" | "email" | "password" | "number" | "tel" | "url";
	helperText?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			error,
			variant = "default",
			type = "text",
			helperText,
			leftIcon,
			rightIcon,
			className = "",
			onFocus,
			onBlur,
			onChange,
			...props
		},
		ref
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const [showPassword, setShowPassword] = useState(false);
		const [hasValue, setHasValue] = useState(false);

		const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(true);
			onFocus?.(e);
		};

		const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(false);
			onBlur?.(e);
		};

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setHasValue(e.target.value.length > 0);
			onChange?.(e);
		};

		const inputType = type === "password" && showPassword ? "text" : type;

		const baseClasses = "w-full transition-all duration-200 font-inter";
		const variantClasses = {
			default:
				"border border-gray-300 rounded-lg px-4 py-3 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-gray-600 dark:focus:border-white dark:focus:ring-white/10",
			minimal:
				"border-b-2 border-gray-300 px-2 py-3 focus:border-black dark:border-gray-600 dark:focus:border-white",
		};

		const focusClasses = isFocused
			? "ring-2 ring-black/10 dark:ring-white/10"
			: "";
		const errorClasses = error
			? "border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400"
			: "";
		const leftIconClasses = leftIcon ? "pl-12" : "";
		const rightIconClasses = rightIcon || type === "password" ? "pr-12" : "";

		return (
			<div className='w-full space-y-2'>
				{label && (
					<motion.label
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
						{label}
					</motion.label>
				)}

				<div className='relative'>
					{leftIcon && (
						<div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
							{leftIcon}
						</div>
					)}

					<motion.input
						ref={ref}
						type={inputType}
						className={`
              ${baseClasses}
              ${variantClasses[variant]}
              ${focusClasses}
              ${errorClasses}
              ${leftIconClasses}
              ${rightIconClasses}
              ${className}
            `}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onChange={handleChange}
						{...(props as any)}
					/>

					{type === "password" && (
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'>
							<motion.div
								initial={false}
								animate={{ rotate: showPassword ? 180 : 0 }}
								transition={{ duration: 0.2 }}>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</motion.div>
						</button>
					)}

					{rightIcon && type !== "password" && (
						<div className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
							{rightIcon}
						</div>
					)}
				</div>

				<AnimatePresence>
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10, height: 0 }}
							animate={{ opacity: 1, y: 0, height: "auto" }}
							exit={{ opacity: 0, y: -10, height: 0 }}
							transition={{ duration: 0.2 }}
							className='text-sm text-red-500 dark:text-red-400'>
							{error}
						</motion.div>
					)}

					{helperText && !error && (
						<motion.div
							initial={{ opacity: 0, y: -5 }}
							animate={{ opacity: 1, y: 0 }}
							className='text-sm text-gray-500 dark:text-gray-400'>
							{helperText}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	}
);

Input.displayName = "Input";

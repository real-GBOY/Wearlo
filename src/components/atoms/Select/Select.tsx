/** @format */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../../utils/cn";

interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface SelectProps {
	options: SelectOption[];
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	error?: string;
	label?: string;
}

const Select: React.FC<SelectProps> = ({
	options,
	value,
	onChange,
	placeholder = "Select an option",
	disabled = false,
	className,
	error,
	label,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<
		SelectOption | undefined
	>(options.find((option) => option.value === value));
	const selectRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		setSelectedOption(options.find((option) => option.value === value));
	}, [value, options]);

	const handleSelect = (option: SelectOption) => {
		if (option.disabled) return;
		setSelectedOption(option);
		onChange(option.value);
		setIsOpen(false);
	};

	const toggleOpen = () => {
		if (!disabled) {
			setIsOpen(!isOpen);
		}
	};

	return (
		<div className={cn("w-full", className)}>
			{label && (
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
					{label}
				</label>
			)}
			<div className='relative' ref={selectRef}>
				<button
					type='button'
					onClick={toggleOpen}
					disabled={disabled}
					className={cn(
						"relative w-full bg-white dark:bg-gray-800 border rounded-lg px-3 py-2 text-left cursor-pointer transition-colors duration-200",
						"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
						"disabled:opacity-50 disabled:cursor-not-allowed",
						error
							? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
							: "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
					)}>
					<span
						className={cn(
							"block truncate",
							selectedOption
								? "text-gray-900 dark:text-gray-100"
								: "text-gray-500 dark:text-gray-400"
						)}>
						{selectedOption ? selectedOption.label : placeholder}
					</span>
					<span className='absolute inset-y-0 right-0 flex items-center pr-2'>
						<motion.div
							animate={{ rotate: isOpen ? 180 : 0 }}
							transition={{ duration: 0.2 }}>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</motion.div>
					</span>
				</button>

				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -10, scale: 0.95 }}
							transition={{ duration: 0.15 }}
							className='absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto'>
							{options.map((option) => (
								<button
									key={option.value}
									type='button'
									onClick={() => handleSelect(option)}
									disabled={option.disabled}
									className={cn(
										"w-full px-3 py-2 text-left cursor-pointer transition-colors duration-150",
										"hover:bg-gray-50 dark:hover:bg-gray-700",
										"focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700",
										"disabled:opacity-50 disabled:cursor-not-allowed",
										option.value === value
											? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
											: "text-gray-900 dark:text-gray-100"
									)}>
									<div className='flex items-center justify-between'>
										<span className='truncate'>{option.label}</span>
										{option.value === value && (
											<Check className='h-4 w-4 text-blue-600 dark:text-blue-400' />
										)}
									</div>
								</button>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			{error && (
				<p className='mt-1 text-sm text-red-600 dark:text-red-400'>{error}</p>
			)}
		</div>
	);
};

export default Select;

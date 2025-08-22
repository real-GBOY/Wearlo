/** @format */

import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../atoms/Input";
import { Button } from "../../atoms/Button";
import {
	Mail,
	Lock,
	User,
	AlertCircle,
	Phone,
	MapPin,
	Building,
	Hash,
	Globe,
} from "lucide-react";

interface LoginFormData {
	email: string;
	password: string;
}

interface SignupFormData extends LoginFormData {
	name: string;
	phone: string;
	address: string;
	city: string;
	zip: string;
	country: string;
	confirmPassword: string;
}

type FormData = LoginFormData | SignupFormData;

const loginSchema = yup.object({
	email: yup
		.string()
		.email("Please enter a valid email")
		.required("Email is required"),
	password: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});

const signupSchema = yup.object({
	email: yup
		.string()
		.email("Please enter a valid email")
		.required("Email is required"),
	password: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref("password")], "Passwords must match")
		.required("Please confirm your password"),
	name: yup.string().required("Full name is required"),
	phone: yup.string().required("Phone number is required"),
	address: yup.string().required("Address is required"),
	city: yup.string().required("City is required"),
	zip: yup.string().required("ZIP code is required"),
	country: yup.string().required("Country is required"),
});

interface AuthFormProps {
	mode: "login" | "signup";
	onModeChange: (mode: "login" | "signup") => void;
	onSubmit: (data: FormData) => void;
	isLoading?: boolean;
	error?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
	mode,
	onModeChange,
	onSubmit,
	isLoading = false,
	error,
}) => {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<FormData>({
		resolver: yupResolver(mode === "login" ? loginSchema : signupSchema),
		mode: "onChange",
	});

	const handleFormSubmit = async (data: FormData) => {
		try {
			await onSubmit(data);
			console.log("Form submitted:", data);
		} catch (error) {
			console.error("Form submission error:", error);
		}
	};

	const handleModeChange = (newMode: "login" | "signup") => {
		onModeChange(newMode);
		reset();
	};

	const isFormValid = isValid && Object.keys(errors).length === 0;

	// Type-safe error access
	const getFieldError = (fieldName: string) => {
		return (errors as any)[fieldName]?.message;
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className='w-full max-w-md mx-auto space-y-6'>
			<div className='text-center space-y-2'>
				<motion.h1
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className='text-3xl font-bold text-gray-900 dark:text-white'>
					{mode === "login" ? "Welcome Back" : "Create Account"}
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: -5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='text-gray-600 dark:text-gray-400'>
					{mode === "login" ? "Sign in to your account" : "Join us today"}
				</motion.p>
			</div>

			{/* Error Message Display */}
			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className='flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
						<AlertCircle className='w-5 h-5 text-red-500 flex-shrink-0' />
						<p className='text-sm text-red-700 dark:text-red-400'>{error}</p>
					</motion.div>
				)}
			</AnimatePresence>

			<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
				<AnimatePresence mode='wait'>
					{mode === "signup" && (
						<motion.div
							key='name-field'
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}>
							<Controller
								name='name'
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										label='Full Name'
										placeholder='John Doe'
										leftIcon={<User size={20} />}
										error={getFieldError("name")}
										variant='default'
									/>
								)}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				<Controller
					name='email'
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							label='Email'
							type='email'
							placeholder='john@example.com'
							leftIcon={<Mail size={20} />}
							error={getFieldError("email")}
							variant='default'
						/>
					)}
				/>

				<Controller
					name='password'
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							label='Password'
							type='password'
							placeholder='••••••••'
							leftIcon={<Lock size={20} />}
							error={getFieldError("password")}
							helperText='Must be at least 6 characters'
							variant='default'
						/>
					)}
				/>

				{/* Additional signup fields */}
				<AnimatePresence mode='wait'>
					{mode === "signup" && (
						<motion.div
							key='additional-fields'
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className='space-y-4'>
							<Controller
								name='phone'
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										label='Phone Number'
										placeholder='+201234567890'
										leftIcon={<Phone size={20} />}
										error={getFieldError("phone")}
										variant='default'
									/>
								)}
							/>
							<Controller
								name='address'
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										label='Address'
										placeholder='123 Main St'
										leftIcon={<MapPin size={20} />}
										error={getFieldError("address")}
										variant='default'
									/>
								)}
							/>
							<div className='grid grid-cols-3 gap-4'>
								<Controller
									name='city'
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label='City'
											placeholder='Cairo'
											leftIcon={<Building size={20} />}
											error={getFieldError("city")}
											variant='default'
										/>
									)}
								/>
								<Controller
									name='zip'
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label='ZIP'
											placeholder='12345'
											leftIcon={<Hash size={20} />}
											error={getFieldError("zip")}
											variant='default'
										/>
									)}
								/>
								<Controller
									name='country'
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											label='Country'
											placeholder='EG'
											leftIcon={<Globe size={20} />}
											error={getFieldError("country")}
											variant='default'
										/>
									)}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence mode='wait'>
					{mode === "signup" && (
						<motion.div
							key='confirm-password'
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}>
							<Controller
								name='confirmPassword'
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										label='Confirm Password'
										type='password'
										placeholder='••••••••'
										leftIcon={<Lock size={20} />}
										error={getFieldError("confirmPassword")}
										variant='default'
									/>
								)}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className='pt-4'>
					<Button
						type='submit'
						variant='primary'
						size='lg'
						disabled={!isFormValid || isLoading}
						className='w-full'>
						<AnimatePresence mode='wait'>
							{isLoading ? (
								<motion.div
									key='loading'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className='flex items-center justify-center space-x-2'>
									<motion.div
										animate={{ rotate: 360 }}
										transition={{
											duration: 1,
											repeat: Infinity,
											ease: "linear",
										}}
										className='w-5 h-5 border-2 border-white border-t-transparent rounded-full'
									/>
									<span>Processing...</span>
								</motion.div>
							) : (
								<motion.span
									key='text'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}>
									{mode === "login" ? "Sign In" : "Create Account"}
								</motion.span>
							)}
						</AnimatePresence>
					</Button>
				</motion.div>
			</form>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				className='text-center'>
				<p className='text-gray-600 dark:text-gray-400'>
					{mode === "login"
						? "Don't have an account? "
						: "Already have an account? "}
					<button
						type='button'
						onClick={() =>
							handleModeChange(mode === "login" ? "signup" : "login")
						}
						className='text-black dark:text-white font-medium hover:underline transition-colors duration-200'>
						{mode === "login" ? "Sign up" : "Sign in"}
					</button>
				</p>
			</motion.div>
		</motion.div>
	);
};

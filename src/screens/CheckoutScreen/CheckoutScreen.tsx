/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, CheckCircle, Lock } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { Typography } from "../../components/atoms/Typography/Typography";
import { Button } from "../../components/atoms/Button/Button";
import { Input } from "../../components/atoms/Input/Input";
import Select from "../../components/atoms/Select/Select";
import Card from "../../components/atoms/Card/Card";
import { Icon } from "../../components/atoms/Icon/Icon";

export const CheckoutScreen: React.FC = () => {
	const navigate = useNavigate();
	const { state: cartState, clearCart } = useCart();
	const [currentStep, setCurrentStep] = useState(1);
	const [shippingInfo, setShippingInfo] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		state: "",
		zipCode: "",
		country: "",
	});
	const [paymentInfo, setPaymentInfo] = useState({
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardholderName: "",
	});

	const steps = [
		{ id: 1, title: "Shipping", icon: Truck },
		{ id: 2, title: "Payment", icon: CreditCard },
		{ id: 3, title: "Review", icon: CheckCircle },
	];

	const handleShippingChange = (field: string, value: string) => {
		setShippingInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handlePaymentChange = (field: string, value: string) => {
		setPaymentInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handleNext = () => {
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handlePlaceOrder = () => {
		// TODO: Implement order placement API call
		console.log("Placing order:", {
			shippingInfo,
			paymentInfo,
			cart: cartState,
		});

		// Simulate successful order
		clearCart();
		navigate("/profile?tab=orders");
	};

	const formatPrice = (price: number) => {
		return `$${price.toFixed(2)}`;
	};

	const calculateSubtotal = () => {
		return cartState.items.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		);
	};

	const calculateShipping = () => {
		return calculateSubtotal() > 100 ? 0 : 9.99;
	};

	const calculateTax = () => {
		return calculateSubtotal() * 0.08; // 8% tax
	};

	const calculateTotal = () => {
		return calculateSubtotal() + calculateShipping() + calculateTax();
	};

	if (cartState.items.length === 0) {
		return (
			<div className='container mx-auto px-6 py-20 text-center'>
				<Icon icon={Truck} size={64} className='mx-auto mb-4 text-gray-400' />
				<Typography variant='h2' className='mb-4'>
					Your cart is empty
				</Typography>
				<Typography
					variant='body'
					className='mb-6 text-gray-600 dark:text-gray-400'>
					Add some products to your cart before proceeding to checkout
				</Typography>
				<Button onClick={() => navigate("/products")}>Continue Shopping</Button>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-6 py-12'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-center mb-12'>
				<Typography variant='h1' className='mb-4'>
					Checkout
				</Typography>
				<Typography variant='body' className='text-gray-600 dark:text-gray-400'>
					Complete your purchase securely
				</Typography>
			</motion.div>

			{/* Progress Steps */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className='flex justify-center mb-12'>
				<div className='flex items-center space-x-8'>
					{steps.map((step, index) => (
						<div key={step.id} className='flex items-center'>
							<div
								className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
									currentStep >= step.id
										? "border-blue-600 bg-blue-600 text-white"
										: "border-gray-300 dark:border-gray-600 text-gray-400"
								}`}>
								{currentStep > step.id ? (
									<Icon icon={CheckCircle} size={24} />
								) : (
									<Icon icon={step.icon} size={24} />
								)}
							</div>
							<span
								className={`ml-3 text-sm font-medium ${
									currentStep >= step.id
										? "text-blue-600 dark:text-blue-400"
										: "text-gray-500 dark:text-gray-400"
								}`}>
								{step.title}
							</span>
							{index < steps.length - 1 && (
								<div
									className={`w-16 h-0.5 ml-8 ${
										currentStep > step.id
											? "bg-blue-600"
											: "bg-gray-300 dark:bg-gray-600"
									}`}
								/>
							)}
						</div>
					))}
				</div>
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Main Content */}
				<div className='lg:col-span-2'>
					<motion.div
						key={currentStep}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.4 }}>
						{/* Step 1: Shipping Information */}
						{currentStep === 1 && (
							<Card className='p-6'>
								<Typography variant='h2' className='mb-6'>
									Shipping Information
								</Typography>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<Input
										placeholder='First Name'
										value={shippingInfo.firstName}
										onChange={(e) =>
											handleShippingChange("firstName", e.target.value)
										}
									/>
									<Input
										placeholder='Last Name'
										value={shippingInfo.lastName}
										onChange={(e) =>
											handleShippingChange("lastName", e.target.value)
										}
									/>
									<Input
										type='email'
										placeholder='Email'
										value={shippingInfo.email}
										onChange={(e) =>
											handleShippingChange("email", e.target.value)
										}
									/>
									<Input
										placeholder='Phone'
										value={shippingInfo.phone}
										onChange={(e) =>
											handleShippingChange("phone", e.target.value)
										}
									/>
									<div className='md:col-span-2'>
										<Input
											placeholder='Address'
											value={shippingInfo.address}
											onChange={(e) =>
												handleShippingChange("address", e.target.value)
											}
										/>
									</div>
									<Input
										placeholder='City'
										value={shippingInfo.city}
										onChange={(e) =>
											handleShippingChange("city", e.target.value)
										}
									/>
									<Input
										placeholder='State'
										value={shippingInfo.state}
										onChange={(e) =>
											handleShippingChange("state", e.target.value)
										}
									/>
									<Input
										placeholder='ZIP Code'
										value={shippingInfo.zipCode}
										onChange={(e) =>
											handleShippingChange("zipCode", e.target.value)
										}
									/>
									<Select
										value={shippingInfo.country}
										onChange={(value) => handleShippingChange("country", value)}
										options={[
											{ value: "", label: "Select Country" },
											{ value: "US", label: "United States" },
											{ value: "CA", label: "Canada" },
											{ value: "UK", label: "United Kingdom" },
											{ value: "AU", label: "Australia" },
										]}
										placeholder='Select Country'
									/>
								</div>
							</Card>
						)}

						{/* Step 2: Payment Information */}
						{currentStep === 2 && (
							<Card className='p-6'>
								<Typography variant='h2' className='mb-6'>
									Payment Information
								</Typography>
								<div className='space-y-4'>
									<Input
										placeholder='Card Number'
										value={paymentInfo.cardNumber}
										onChange={(e) =>
											handlePaymentChange("cardNumber", e.target.value)
										}
									/>
									<Input
										placeholder='Cardholder Name'
										value={paymentInfo.cardholderName}
										onChange={(e) =>
											handlePaymentChange("cardholderName", e.target.value)
										}
									/>
									<div className='grid grid-cols-2 gap-4'>
										<Input
											placeholder='MM/YY'
											value={paymentInfo.expiryDate}
											onChange={(e) =>
												handlePaymentChange("expiryDate", e.target.value)
											}
										/>
										<Input
											placeholder='CVV'
											value={paymentInfo.cvv}
											onChange={(e) =>
												handlePaymentChange("cvv", e.target.value)
											}
										/>
									</div>
									<div className='flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
										<Icon icon={Lock} size={16} />
										<span>
											Your payment information is secure and encrypted
										</span>
									</div>
								</div>
							</Card>
						)}

						{/* Step 3: Review Order */}
						{currentStep === 3 && (
							<Card className='p-6'>
								<Typography variant='h2' className='mb-6'>
									Review Your Order
								</Typography>
								<div className='space-y-4'>
									<div className='border-b border-gray-200 dark:border-gray-700 pb-4'>
										<Typography variant='h4' className='mb-2'>
											Shipping Address
										</Typography>
										<Typography
											variant='body'
											className='text-gray-600 dark:text-gray-400'>
											{shippingInfo.firstName} {shippingInfo.lastName}
											<br />
											{shippingInfo.address}
											<br />
											{shippingInfo.city}, {shippingInfo.state}{" "}
											{shippingInfo.zipCode}
											<br />
											{shippingInfo.country}
										</Typography>
									</div>
									<div className='border-b border-gray-200 dark:border-gray-700 pb-4'>
										<Typography variant='h4' className='mb-2'>
											Payment Method
										</Typography>
										<Typography
											variant='body'
											className='text-gray-600 dark:text-gray-400'>
											**** **** **** {paymentInfo.cardNumber.slice(-4)}
											<br />
											{paymentInfo.cardholderName}
										</Typography>
									</div>
								</div>
							</Card>
						)}
					</motion.div>

					{/* Navigation Buttons */}
					<div className='flex justify-between mt-6'>
						<Button
							variant='outline'
							onClick={handleBack}
							disabled={currentStep === 1}>
							Back
						</Button>
						{currentStep < 3 ? (
							<Button onClick={handleNext}>Continue</Button>
						) : (
							<Button
								onClick={handlePlaceOrder}
								className='bg-green-600 hover:bg-green-700'>
								Place Order
							</Button>
						)}
					</div>
				</div>

				{/* Order Summary Sidebar */}
				<div className='lg:col-span-1'>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}>
						<Card className='p-6 sticky top-6'>
							<Typography variant='h3' className='mb-6'>
								Order Summary
							</Typography>

							{/* Cart Items */}
							<div className='space-y-4 mb-6'>
								{cartState.items.map((item) => (
									<div key={item.id} className='flex items-center space-x-3'>
										<img
											src={item.images[0]}
											alt={item.name}
											className='w-16 h-16 object-cover rounded-md'
										/>
										<div className='flex-1'>
											<Typography variant='body' className='font-medium'>
												{item.name}
											</Typography>
											<Typography variant='caption' className='text-gray-500'>
												Qty: {item.quantity}
											</Typography>
										</div>
										<Typography variant='body' className='font-medium'>
											{formatPrice(item.price * item.quantity)}
										</Typography>
									</div>
								))}
							</div>

							{/* Price Breakdown */}
							<div className='space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4'>
								<div className='flex justify-between'>
									<span>Subtotal</span>
									<span>{formatPrice(calculateSubtotal())}</span>
								</div>
								<div className='flex justify-between'>
									<span>Shipping</span>
									<span>
										{calculateShipping() === 0
											? "Free"
											: formatPrice(calculateShipping())}
									</span>
								</div>
								<div className='flex justify-between'>
									<span>Tax</span>
									<span>{formatPrice(calculateTax())}</span>
								</div>
								<div className='flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-3'>
									<span>Total</span>
									<span>{formatPrice(calculateTotal())}</span>
								</div>
							</div>

							{calculateShipping() === 0 && (
								<div className='mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
									<Typography
										variant='caption'
										className='text-green-700 dark:text-green-400'>
										🎉 Free shipping on orders over $100!
									</Typography>
								</div>
							)}
						</Card>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

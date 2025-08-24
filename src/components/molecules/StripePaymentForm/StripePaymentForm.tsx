/** @format */

import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { Lock, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import { Typography } from "../../atoms/Typography/Typography";
import { Button } from "../../atoms/Button/Button";
import { Icon } from "../../atoms/Icon/Icon";

interface StripePaymentFormProps {
	amount: number;
	onPaymentSuccess: (paymentIntent: any) => void;
	onPaymentError: (error: string) => void;
	isLoading?: boolean;
}

const cardElementOptions = {
	style: {
		base: {
			fontSize: "16px",
			color: "#1f2937",
			"::placeholder": {
				color: "#9ca3af",
			},
			backgroundColor: "transparent",
			fontFamily: "Inter, system-ui, sans-serif",
		},
		invalid: {
			color: "#ef4444",
		},
	},
};

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
	amount,
	onPaymentSuccess,
	onPaymentError,
	isLoading = false,
}) => {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState<string | null>(null);
	const [processing, setProcessing] = useState(false);
	const [succeeded, setSucceeded] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setProcessing(true);
		setError(null);

		try {
			const cardElement = elements.getElement(CardElement);
			if (!cardElement) {
				throw new Error("Card element not found");
			}

			// Create payment method
			const { error: paymentMethodError, paymentMethod } =
				await stripe.createPaymentMethod({
					type: "card",
					card: cardElement,
				});

			if (paymentMethodError) {
				throw new Error(
					paymentMethodError.message || "Payment method creation failed"
				);
			}

			// In a real app, you would send the payment method to your backend
			// and create a payment intent there. For demo purposes, we'll simulate success.

			// Simulate payment processing delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Simulate successful payment
			const mockPaymentIntent = {
				id: `pi_${Date.now()}`,
				amount: Math.round(amount * 100),
				currency: "egp",
				status: "succeeded",
				payment_method: paymentMethod.id,
			};

			setSucceeded(true);
			setProcessing(false);
			onPaymentSuccess(mockPaymentIntent);
		} catch (err: any) {
			setError(err.message || "Payment failed");
			setProcessing(false);
			onPaymentError(err.message || "Payment failed");
		}
	};

	const formatAmount = (amount: number) => {
		return `EGP ${amount.toFixed(2)}`;
	};

	if (succeeded) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className='text-center p-6'>
				<Icon
					icon={CheckCircle}
					size={64}
					className='mx-auto mb-4 text-green-500'
				/>
				<Typography variant='h3' className='mb-2 text-green-600'>
					Payment Successful!
				</Typography>
				<Typography variant='body' className='text-gray-600'>
					Your payment of {formatAmount(amount)} has been processed
					successfully.
				</Typography>
			</motion.div>
		);
	}

	return (
		<motion.form
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			onSubmit={handleSubmit}
			className='space-y-6'>
			<div className='space-y-4'>
				<div className='flex items-center space-x-2 text-sm text-gray-600'>
					<Icon icon={CreditCard} size={16} />
					<span>Secure payment powered by Stripe</span>
				</div>

				<div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
					<CardElement options={cardElementOptions} className='min-h-[40px]' />
				</div>

				{error && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className='flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
						<Icon icon={AlertCircle} size={16} className='text-red-500' />
						<Typography variant='body' className='text-red-600'>
							{error}
						</Typography>
					</motion.div>
				)}

				<div className='flex items-center space-x-2 text-sm text-gray-600'>
					<Icon icon={Lock} size={16} />
					<span>
						Your payment information is secure and encrypted. We never store
						your card details.
					</span>
				</div>
			</div>

			<Button
				type='submit'
				disabled={!stripe || processing || isLoading}
				className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400'>
				{processing ? (
					<div className='flex items-center space-x-2'>
						<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
						<span>Processing...</span>
					</div>
				) : (
					`Pay ${formatAmount(amount)}`
				)}
			</Button>

			<div className='text-center'>
				<Typography variant='caption' className='text-gray-500'>
					By clicking "Pay", you agree to our terms of service and privacy
					policy.
				</Typography>
			</div>
		</motion.form>
	);
};

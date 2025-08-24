/** @format */

import React, { useState } from "react";
import { Typography } from "../../atoms/Typography/Typography";
import Card from "../../atoms/Card/Card";
import { Button } from "../../atoms/Button/Button";
import { Icon } from "../../atoms/Icon/Icon";
import { Ruler } from "lucide-react";

interface SizeChart {
	[key: string]: {
		[size: string]: string;
	};
}

interface MeasurementGuide {
	[key: string]: {
		chest: string;
		waist: string;
		hips: string;
		length: string;
		shoulders: string;
	};
}

export const SizeGuide: React.FC = () => {
	const selectedCategory = "tops";

	const sizeCharts: SizeChart = {
		tops: {
			XS: "32-34",
			S: "34-36",
			M: "36-38",
			L: "38-40",
			XL: "40-42",
			XXL: "42-44",
		},
	};

	const measurementGuides: MeasurementGuide = {
		tops: {
			chest: "Measure around the fullest part of your chest",
			waist: "Measure around your natural waistline",
			length: "Measure from shoulder to desired length",
			shoulders: "Measure across the back from shoulder to shoulder",
			hips: "Measure around the fullest part of your hips",
		},
	};

	const categories = [{ id: "tops", name: "Tops & Shirts", icon: "👕" }];

	const renderSizeChart = () => {
		const chart = sizeCharts[selectedCategory];
		const sizes = Object.keys(chart);
		const measurements = Object.values(chart);

		return (
			<div className='overflow-x-auto'>
				<table className='w-full border-collapse border border-gray-200'>
					<thead>
						<tr className='bg-gray-50'>
							<th className='border border-gray-200 px-4 py-3 text-left font-semibold'>
								Size
							</th>
							<th className='border border-gray-200 px-4 py-3 text-left font-semibold'>
								{selectedCategory === "shoes" ? "US Size" : "Chest (inches)"}
							</th>
							{selectedCategory !== "shoes" && (
								<>
									<th className='border border-gray-200 px-4 py-3 text-left font-semibold'>
										Waist (inches)
									</th>
									<th className='border border-gray-200 px-4 py-3 text-left font-semibold'>
										Hips (inches)
									</th>
								</>
							)}
						</tr>
					</thead>
					<tbody>
						{sizes.map((size, index) => (
							<tr key={size} className='hover:bg-gray-50'>
								<td className='border border-gray-200 px-4 py-3 font-medium'>
									{size}
								</td>
								<td className='border border-gray-200 px-4 py-3'>
									{measurements[index]}
								</td>
								{selectedCategory !== "shoes" && (
									<>
										<td className='border border-gray-200 px-4 py-3'>
											{size === "XS"
												? "26-28"
												: size === "S"
												? "28-30"
												: size === "M"
												? "30-32"
												: size === "L"
												? "32-34"
												: size === "XL"
												? "34-36"
												: "36-38"}
										</td>
										<td className='border border-gray-200 px-4 py-3'>
											{size === "XS"
												? "34-36"
												: size === "S"
												? "36-38"
												: size === "M"
												? "38-40"
												: size === "L"
												? "40-42"
												: size === "XL"
												? "42-44"
												: "44-46"}
										</td>
									</>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	const renderMeasurementGuide = () => {
		const guide = measurementGuides[selectedCategory];

		return (
			<div className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Card className='p-6'>
						<div className='flex items-center mb-4'>
							<Icon
								icon={Ruler}
								size={24}
								className='w-6 h-6 text-blue-600 mr-3'
							/>
							<Typography variant='h3' className='text-lg font-semibold'>
								Chest
							</Typography>
						</div>
						<Typography variant='body' className='text-gray-600'>
							{guide.chest}
						</Typography>
					</Card>

					<Card className='p-6'>
						<div className='flex items-center mb-4'>
							<Icon
								icon={Ruler}
								size={24}
								className='w-6 h-6 text-green-600 mr-3'
							/>
							<Typography variant='h3' className='text-lg font-semibold'>
								Waist
							</Typography>
						</div>
						<Typography variant='body' className='text-gray-600'>
							{guide.waist}
						</Typography>
					</Card>

					<Card className='p-6'>
						<div className='flex items-center mb-4'>
							<Icon
								icon={Ruler}
								size={24}
								className='w-6 h-6 text-purple-600 mr-3'
							/>
							<Typography variant='h3' className='text-lg font-semibold'>
								Hips
							</Typography>
						</div>
						<Typography variant='body' className='text-gray-600'>
							{guide.hips}
						</Typography>
					</Card>

					<Card className='p-6'>
						<div className='flex items-center mb-4'>
							<Icon
								icon={Ruler}
								size={24}
								className='w-6 h-6 text-orange-600 mr-3'
							/>
							<Typography variant='h3' className='text-lg font-semibold'>
								Length
							</Typography>
						</div>
						<Typography variant='body' className='text-gray-600'>
							{guide.length}
						</Typography>
					</Card>
				</div>

				<div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
					<Typography
						variant='h3'
						className='text-lg font-semibold text-blue-800 mb-3'>
						📋 Measurement Tips
					</Typography>
					<ul className='space-y-2 text-blue-700'>
						<li>• Use a flexible measuring tape</li>
						<li>• Don't pull the tape too tight</li>
						<li>• Measure over thin clothing or bare skin</li>
						<li>• Keep the tape parallel to the floor</li>
						<li>• For best results, have someone help you measure</li>
					</ul>
				</div>
			</div>
		);
	};

	const renderSizingTips = () => {
		return (
			<div className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Card className='p-6 bg-gradient-to-br from-purple-50 to-pink-50'>
						<Typography
							variant='h3'
							className='text-lg font-semibold text-purple-800 mb-3'>
							🎯 Finding Your Perfect Fit
						</Typography>
						<ul className='space-y-2 text-purple-700'>
							<li>• Consider your body shape and proportions</li>
							<li>
								• Check the garment's fit description (slim, regular, loose)
							</li>
							<li>• Read customer reviews for sizing feedback</li>
							<li>• When in doubt, size up for comfort</li>
						</ul>
					</Card>

					<Card className='p-6 bg-gradient-to-br from-green-50 to-blue-50'>
						<Typography
							variant='h3'
							className='text-lg font-semibold text-green-800 mb-3'>
							🌍 International Sizing
						</Typography>
						<ul className='space-y-2 text-green-700'>
							<li>• US sizes are typically 2 sizes larger than EU</li>
							<li>• Asian sizes run smaller than Western sizes</li>
							<li>• Always check the size chart for each brand</li>
							<li>• Consider ordering multiple sizes to find the best fit</li>
						</ul>
					</Card>

					<Card className='p-6 bg-gradient-to-br from-yellow-50 to-orange-50'>
						<Typography
							variant='h3'
							className='text-lg font-semibold text-orange-800 mb-3'>
							📱 Virtual Fitting
						</Typography>
						<ul className='space-y-2 text-orange-700'>
							<li>• Use our AR try-on feature when available</li>
							<li>• Compare with items you already own</li>
							<li>• Check the model's measurements and size worn</li>
							<li>• Use our size recommendation algorithm</li>
						</ul>
					</Card>

					<Card className='p-6 bg-gradient-to-br from-red-50 to-pink-50'>
						<Typography
							variant='h3'
							className='text-lg font-semibold text-red-800 mb-3'>
							⚠️ Common Mistakes
						</Typography>
						<ul className='space-y-2 text-red-700'>
							<li>• Don't assume your size is the same across all brands</li>
							<li>• Avoid ordering based on age or weight alone</li>
							<li>• Don't forget to check return policies</li>
							<li>• Consider fabric stretch and fit preferences</li>
						</ul>
					</Card>
				</div>
			</div>
		);
	};

	return (
		<section className='py-12 bg-gray-50'>
			<div className='container mx-auto px-4'>
				<div className='text-center mb-8'>
					<Typography
						variant='h2'
						className='text-3xl font-bold text-gray-900 mb-4'>
						Size Guide
					</Typography>
					<Typography
						variant='body'
						className='text-lg text-gray-600 max-w-2xl mx-auto'>
						Find your perfect fit with our size chart for tops and shirts.
					</Typography>
				</div>

				{/* Size Chart */}
				<div className='max-w-4xl mx-auto'>
					<Card className='p-8'>
						<Typography
							variant='h2'
							className='text-2xl font-bold mb-6 text-center'>
							{categories.find((c) => c.id === selectedCategory)?.name} Size
							Chart
						</Typography>
						{renderSizeChart()}
					</Card>
				</div>
			</div>
		</section>
	);
};

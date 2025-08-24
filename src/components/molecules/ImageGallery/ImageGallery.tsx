/** @format */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "../../atoms/Icon/Icon";

interface ImageGalleryProps {
	images: string[];
	alt: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);

	const nextImage = () => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	return (
		<div className='flex gap-6'>
			{/* Main Image Display */}
			<div className='flex-1 relative'>
				<div className='overflow-hidden bg-gray-100 rounded-lg'>
					<AnimatePresence mode='wait'>
						<motion.img
							key={currentIndex}
							src={images[currentIndex]}
							alt={`${alt} - Image ${currentIndex + 1}`}
							className={`w-full h-auto max-w-full transition-all duration-300 cursor-pointer ${
								isZoomed ? "scale-150" : "scale-100"
							}`}
							onClick={() => setIsZoomed(!isZoomed)}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.3 }}
						/>
					</AnimatePresence>
				</div>

				{/* Image Counter */}
				<div className='absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium'>
					{currentIndex + 1} / {images.length}
				</div>

				{/* Navigation Arrows */}
				{images.length > 1 && (
					<>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={prevImage}
							className='absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all shadow-lg'>
							<Icon icon={ChevronLeft} size={20} />
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={nextImage}
							className='absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all shadow-lg'>
							<Icon icon={ChevronRight} size={20} />
						</motion.button>
					</>
				)}
			</div>

			{/* Thumbnail Sidebar */}
			{images.length > 1 && (
				<div className='w-28 flex flex-col gap-3 max-h-96 overflow-y-auto pr-2'>
					<div className='text-center text-sm font-medium text-gray-600 mb-2'>
						Thumbnails
					</div>
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`relative group overflow-hidden rounded-lg border-2 transition-all ${
								index === currentIndex
									? "border-blue-500 shadow-lg"
									: "border-gray-200 hover:border-gray-300"
							}`}>
							<img
								src={image}
								alt={`${alt} thumbnail ${index + 1}`}
								className='w-full h-24 object-cover transition-transform group-hover:scale-110'
							/>
							{/* Hover overlay */}
							<div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all' />

							{/* Selected indicator */}
							{index === currentIndex && (
								<div className='absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full'></div>
							)}

							{/* Image number */}
							<div className='absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded'>
								{index + 1}
							</div>
						</button>
					))}

					{/* Scroll indicator */}
					{images.length > 6 && (
						<div className='text-center text-xs text-gray-400 mt-2'>
							Scroll to see more
						</div>
					)}
				</div>
			)}
		</div>
	);
};

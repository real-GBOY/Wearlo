/** @format */

import React from "react";
import { Hero } from "../../components/organisms/Hero/Hero";
import { AboutSection } from "../../components/organisms/AboutSection/AboutSection";
import { CategoriesShowcase } from "../../components/organisms/CategoriesShowcase/CategoriesShowcase";
import { FeaturedProducts } from "../../components/organisms/FeaturedProducts/FeaturedProducts";

import { TestimonialsSection } from "../../components/organisms/TestimonialsSection/TestimonialsSection";
import { InstagramSection } from "../../components/organisms/InstagramSection/InstagramSection";

import { CallToAction } from "../../components/organisms/CallToAction/CallToAction";
import { Footer } from "../../components/organisms/Footer/Footer";

export const LandingScreen: React.FC = () => {
	return (
		<>
			<Hero />

			<CategoriesShowcase />

			<CallToAction />

			<Footer />
		</>
	);
};

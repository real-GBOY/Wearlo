/** @format */

import React from "react";
import { Hero } from "../../components/organisms/Hero/Hero";
import { AboutSection } from "../../components/organisms/AboutSection/AboutSection";
import { CategoriesShowcase } from "../../components/organisms/CategoriesShowcase/CategoriesShowcase";
import { FeaturedProducts } from "../../components/organisms/FeaturedProducts/FeaturedProducts";
import { WhyChooseUs } from "../../components/organisms/WhyChooseUs/WhyChooseUs";
import { TestimonialsSection } from "../../components/organisms/TestimonialsSection/TestimonialsSection";
import { InstagramSection } from "../../components/organisms/InstagramSection/InstagramSection";
import { NewsletterSignup } from "../../components/organisms/NewsletterSignup/NewsletterSignup";
import { CallToAction } from "../../components/organisms/CallToAction/CallToAction";

export const LandingScreen: React.FC = () => {
	return (
		<>
			<Hero />
			<AboutSection />
			<CategoriesShowcase />
			<FeaturedProducts />
			<WhyChooseUs />
			<TestimonialsSection />
			<InstagramSection />
			<NewsletterSignup />
			<CallToAction />
		</>
	);
};

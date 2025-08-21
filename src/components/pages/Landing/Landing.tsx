import React from 'react';
import { Hero } from '../../organisms/Hero/Hero';
import { FeaturedProducts } from '../../organisms/FeaturedProducts/FeaturedProducts';
import { CallToAction } from '../../organisms/CallToAction/CallToAction';

export const Landing: React.FC = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CallToAction />
    </>
  );
};
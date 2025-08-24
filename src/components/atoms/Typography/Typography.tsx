import React from 'react';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
  children: React.ReactNode;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  children,
  className = ''
}) => {
  const baseClasses = 'transition-colors duration-200';
  
  const variantClasses = {
    	h1: 'text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-black',
	h2: 'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-black',
	h3: 'text-2xl md:text-3xl font-bold leading-tight text-black',
	h4: 'text-xl md:text-2xl font-semibold leading-tight text-black',
	body: 'text-base md:text-lg leading-relaxed text-gray-700',
	caption: 'text-sm leading-normal text-gray-600'
  };

  const Component = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';

  return (
    <Component className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </Component>
  );
};
import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ icon: IconComponent, size = 24, className = '' }) => {
  return (
    <IconComponent 
      size={size} 
      className={`text-current transition-colors duration-200 ${className}`} 
    />
  );
};
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Theme = 'light' | 'dark';
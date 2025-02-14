export type ProductDetails = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  images?: string[]; // Optional array of image URLs
  details?: Record<string, string>; // Optional details
  reviews?: {
    author: string;
    rating: number;
    comment: string;
  }[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  details?: Record<string, string>;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

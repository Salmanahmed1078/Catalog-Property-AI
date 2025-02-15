// types/Product.ts
export interface Product {
    id: string;
    name: string;
    description: string;
    details: string;
    price: number;
    images: string[]; // Array of image URLs
    category: string;
    availability: "in stock" | "out of stock";
    createdAt: Date;
    updatedAt: Date;
    rating?: number; // Optional
    tags?: string[]; // Optional
  }
  
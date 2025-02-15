import { create } from 'zustand';
import { databases } from '@/lib/appwrite';
import { Product } from '@/types/product';
import mockProperties from '@/data/mockProperties.json';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: mockProperties as unknown as Product[], // Initialize with mock data
  loading: false, // Start with false since we have initial data
  error: null,
  fetchProducts: async () => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID as string
      );
      if (response.documents.length > 0) {
        set({ products: response.documents as unknown as Product[], loading: false });
      } else {
        set({ products: mockProperties as unknown as Product[], loading: false });
      }
    } catch (err) {
      console.error('Failed to fetch products, using mock data:', err);
      set({ 
        products: mockProperties as unknown as Product[],
        error: 'Failed to fetch products, using mock data instead',
        loading: false 
      });
    }
  },
  getProductById: (id: string) => {
    return get().products.find(product => product.id === id);
  }
}));
import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';
import { Product } from '@/types/product';
import mockProperties from '@/data/mockProperties.json';

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_ID as string
        );
        if (response.documents.length > 0) {
          setProducts(response.documents as unknown as Product[]);
        } else {
          setProducts(mockProperties as unknown as Product[]);
        }
      } catch  {
        setProducts(mockProperties as unknown as Product[]);
        setError('Failed to fetch products from the database. Displaying mock properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export default useProducts;
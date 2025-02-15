'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { useProductStore } from '@/store/useProductStore';
import { Skeleton } from '@/components/ui/skeleton';
import PropertyGallery from '@/components/PropertyGallery';
import Link from 'next/link';
import { Bell, CheckCircle, Home, MessageSquare } from 'lucide-react';
import { account } from "@/lib/appwrite"
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface PropertyClientProps {
  id: string;
}

export default function PropertyClient({ id }: PropertyClientProps) {
  const { loading, error, fetchProducts, getProductById } = useProductStore();
  const [user, setUser] = useState<null | { name: string; email: string }>(null)
  //const [loadingUser, setLoadingUser] = useState(true)
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    //setIsClient(true)
    const fetchUser = async () => {
      try {
        const userData = await account.get()
        setUser(userData)
      } catch {
        setUser(null)
      //} finally {
        //setLoadingUser(false)
      }
    }
    fetchUser()
  }, [])

  const property = getProductById(id);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div>
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center text-red-500">
        Property not found
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-50 bg-opacity-95 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                <Home className="h-6 w-6" />
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  EstateEase
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                {["Buy", "Rent", "Favorites", "Help", "Services", "Blog"].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-sm hover:text-blue-600 transition-colors relative group"
                  >
                    {item}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-violet-600 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-blue-50 transition-colors">
                <MessageSquare className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-blue-100">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user?.name || "John Doe"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "doe@gmail.com"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <PropertyGallery 
        images={property.images} 
        alt={property.name} 
      />
      <div>
        <h1 className="text-4xl font-extrabold my-10">{property.name}</h1>
        <p className="text-2xl font-bold text-blue-600 mb-4">
          {formatPrice(property.price)}
        </p>
        <p className="text-gray-700 mb-4">{property.description}</p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors">
          Inquire
        </button>
        <div className="mt-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">🏡 Property Details</h2>
      <Separator className="mb-4" />
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        {property.details.split("\n").map((line, index) =>
          line.startsWith("-") ? (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span>{line.replace("- ", "")}</span>
            </div>
          ) : (
            <p key={index} className="text-lg font-medium">{line}</p>
          )
        )}
      </div>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Category: {property.category}
          </p>
          <p className="text-sm text-gray-500">
            Availability: {property.availability}
          </p>
          {property.rating && (
            <p className="text-sm text-gray-500">
              Rating: {property.rating} / 5
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
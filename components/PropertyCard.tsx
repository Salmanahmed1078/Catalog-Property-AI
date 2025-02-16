import type { Product } from "@/types/product"
import Image from "next/image"
import Link from "next/link"
import { Star, Tag } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface PropertyCardProps {
  product: Product
}

export default function PropertyCard({ product }: PropertyCardProps) {
  return (
    <Link href={`/properties/${product.id}`} className="block group">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-white/20">
        <div className="relative h-48">
          <Image
            src={product.images[0] || "/images/default.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge variant="secondary" className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm">
            {product.availability}
          </Badge>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
              {product.name}
            </h2>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating?.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-blue-600">${product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-500">{product.category}</span>
          </div>
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

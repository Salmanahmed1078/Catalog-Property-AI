"use client"

import { account } from "@/lib/appwrite"
import { useEffect, useState } from "react"
import Link from "next/link"
import Loading from "@/app/loading"
import useProducts from "@/hooks/useProducts"
import PropertyCard from "@/components/PropertyCard"
import { Search, Bell, MessageSquare, X, Home, Bot, Star } from "lucide-react"
import AIAnalyzer from "./AIAnalyzer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FilterState {
  priceRange: [number, number]
  categories: string[]
  tags: string[]
  minRating: number
  searchTerm: string
  availability: string[]
}

export default function HomePageComponent() {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<null | { name: string; email: string }>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const { products, loading: loadingProducts, error } = useProducts()
  const [showAI, setShowAI] = useState(false)

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000000],
    categories: [],
    tags: [],
    minRating: 0,
    searchTerm: "",
    availability: [],
  })

  // Get unique categories and tags from products
  const categories = Array.from(new Set(products.map((p) => p.category)))
  const allTags = Array.from(new Set(products.flatMap((p) => p.tags || [])))

  useEffect(() => {
    setIsClient(true)
    const fetchUser = async () => {
      try {
        const userData = await account.get()
        setUser(userData)
      } catch {
        setUser(null)
      } finally {
        setLoadingUser(false)
      }
    }
    fetchUser()
  }, [])

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 2000000],
      categories: [],
      tags: [],
      minRating: 0,
      searchTerm: "",
      availability: [],
    })
  }

  // Filter products based on all criteria
  const filteredProducts = products.filter((product) => {
    const matchesSearch = filters.searchTerm
      ? product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      : true

    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]

    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category)

    const matchesTags =
      filters.tags.length === 0 || (product.tags && filters.tags.some((tag) => product.tags?.includes(tag)))

    const matchesRating = !product.rating || product.rating >= filters.minRating

    const matchesAvailability = filters.availability.length === 0 || filters.availability.includes(product.availability)

    return matchesSearch && matchesPrice && matchesCategory && matchesTags && matchesRating && matchesAvailability
  })

  if (!isClient) return <Loading />
  if (loadingUser || loadingProducts) return <Loading />
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
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
              <div className="relative hidden md:block w-80">
                <Input
                  type="search"
                  placeholder="Search properties..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10 pr-8 focus:ring-2 ring-blue-200 transition-shadow"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                {filters.searchTerm && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, searchTerm: "" }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </div>

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

      <div className="pt-16 flex">
        {/* Sidebar Filters */}
        <aside className="w-72 fixed left-0 top-16 bottom-0 bg-white bg-opacity-95 backdrop-blur-sm border-r p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Filters
            </h2>
            <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              Clear all
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Price Range</h3>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
              max={2000000}
              step={1000}
              className="mb-4"
            />
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [Number(e.target.value), prev.priceRange[1]],
                    }))
                  }
                  className="text-sm focus:ring-2 ring-blue-200 transition-shadow"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="flex-1">
                <Input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], Number(e.target.value)],
                    }))
                  }
                  className="text-sm focus:ring-2 ring-blue-200 transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center group">
                  <Checkbox
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        categories: checked
                          ? [...prev.categories, category]
                          : prev.categories.filter((c) => c !== category),
                      }))
                    }}
                    className="group-hover:border-blue-400 transition-colors"
                  />
                  <label className="ml-2 text-sm group-hover:text-blue-600 transition-colors cursor-pointer">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
                    }))
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Minimum Rating</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilters((prev) => ({ ...prev, minRating: rating }))}
                  className={`p-2 rounded transition-colors ${
                    filters.minRating === rating ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                  }`}
                >
                  <Star
                    className={`h-5 w-5 transition-colors ${
                      rating <= filters.minRating ? "fill-current text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Availability</h3>
            <div className="space-y-2">
              {["in stock", "out of stock"].map((status) => (
                <div key={status} className="flex items-center group">
                  <Checkbox
                    checked={filters.availability.includes(status)}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => ({
                        ...prev,
                        availability: checked
                          ? [...prev.availability, status]
                          : prev.availability.filter((s) => s !== status),
                      }))
                    }}
                    className="group-hover:border-blue-400 transition-colors"
                  />
                  <label className="ml-2 text-sm capitalize group-hover:text-blue-600 transition-colors cursor-pointer">
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {filteredProducts.length} Properties Available
            </h1>
            <Button
              onClick={() => setShowAI(true)}
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Bot className="mr-2 h-5 w-5" />
              AI Property Finder
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <PropertyCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>

      {/* AI Assistant Sheet */}
      <Sheet open={showAI} onOpenChange={setShowAI}>
        <SheetContent className="w-[90vw] sm:w-[600px] overflow-hidden flex flex-col bg-gradient-to-br from-white to-gray-50">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                AI Property Finder
              </span>
            </SheetTitle>
            <SheetDescription className="text-gray-600">
              Describe your ideal property and let our AI find the perfect match for you.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-grow mt-6">
            <AIAnalyzer
              products={products}
              onClose={() => setShowAI(false)}
              currentFilters={filters}
              onUpdateFilters={setFilters}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
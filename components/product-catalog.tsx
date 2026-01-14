"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Plus, Check, AlertCircle } from "lucide-react"
import { getAllProducts } from "@/app/api/Service"
import { toast } from "sonner" // Ensure sonner is installed or remove

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean // Keep for compatibility if needed, but rely on stock
  stock: number // ✅ Ensure this is mapped from API
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set())
  const { addToCart, items } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = (await getAllProducts()) as any[] // API returns raw data
        console.log("Fetched Products:", data)

        // Map API response to Component State Key
        const formattedProducts: Product[] = data.map((item: any) => ({
          id: item._id || item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
          category: item.category,
          stock: item.stock || 0, // ✅ Ensure stock is captured
          inStock: (item.stock || 0) > 0
        }))

        setProducts(formattedProducts)

        const uniqueCategories = ["All", ...new Set(formattedProducts.map((item) => item.category))]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Failed to load products:", error)
      }
    }

    fetchProducts()
  }, [])


  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const handleAddToCart = (product: Product) => {
    // Basic stock check before calling context
    if (product.stock <= 0) {
      toast.error("Out of stock")
      return;
    }

    addToCart(product)

    // Visual feedback
    setAddedProducts((prev) => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedProducts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Smart Home Products</h3>
          <p className="text-neutral-600">
            Enhance your home with IoT devices and smart solutions
          </p>
        </div>
        <ShoppingCart className="w-8 h-8 text-[#FF6B35]" />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                ? "bg-[#FF6B35] text-white"
                : "border border-neutral-300 hover:bg-neutral-50"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isOutOfStock = product.stock <= 0;

          return (
            <div
              key={product.id}
              className="border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
            >
              <div className="aspect-square bg-neutral-100 relative overflow-hidden group">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-neutral-500 font-medium px-2 py-0.5 bg-neutral-100 rounded-full">
                    {product.category}
                  </span>
                  <span className={`text-xs font-medium ${product.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                    {product.stock > 0 ? `${product.stock} left` : ''}
                  </span>
                </div>

                <h4 className="font-bold mb-1 text-lg leading-tight line-clamp-1" title={product.name}>
                  {product.name}
                </h4>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2 flex-grow">{product.description}</p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-[#FF6B35]">${product.price}</span>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                    className={`
                    px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2
                    ${isOutOfStock
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'bg-[#FF6B35] text-white hover:bg-[#ff5722] hover:shadow-md active:scale-95'
                      }
                  `}
                  >
                    {addedProducts.has(product.id) ? (
                      <>
                        <Check className="w-4 h-4" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

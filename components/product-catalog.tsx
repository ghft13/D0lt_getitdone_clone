"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Plus, Check } from "lucide-react"
import { getAllProducts } from "@/app/api/Service"
import HandleAddToCart from "@/components/HandleAddToCart"
interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set())
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = (await getAllProducts()) as Product[]
        console.log(data)
        setProducts(data)

        const uniqueCategories = ["All", ...new Set(data.map((item) => item.category))]
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

  const handleAddToCart = (product: any) => {
    addToCart(product)
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
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
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
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square bg-neutral-100 relative overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold">Out of Stock</span>
                </div>
              )} */}
            </div>

            <div className="p-4">
              <div className="text-xs text-neutral-600 mb-1">{product.category}</div>
              <h4 className="font-bold mb-2">{product.name}</h4>
              <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#FF6B35]">${product.price}</span>
             <HandleAddToCart />

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { PRODUCTS, PRODUCT_CATEGORIES } from "@/lib/products"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, Plus, Check } from "lucide-react"

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set())
  const { addToCart } = useCart()

  const filteredProducts =
    selectedCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === selectedCategory)

  const handleAddToCart = (product: (typeof PRODUCTS)[0]) => {
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
          <p className="text-neutral-600">Enhance your home with IoT devices and smart solutions</p>
        </div>
        <ShoppingCart className="w-8 h-8 text-[#FF6B35]" />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {PRODUCT_CATEGORIES.map((category) => (
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
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="text-xs text-neutral-600 mb-1">{product.category}</div>
              <h4 className="font-bold mb-2">{product.name}</h4>
              <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#FF6B35]">${product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock || addedProducts.has(product.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    addedProducts.has(product.id)
                      ? "bg-green-600 text-white"
                      : product.inStock
                        ? "bg-[#FF6B35] text-white hover:bg-[#ff5722]"
                        : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  {addedProducts.has(product.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

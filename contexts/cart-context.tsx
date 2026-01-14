"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner" // Assuming sonner is installed, if not, use alert or console
import { getAllProducts } from "@/app/api/Service"
import { useAuth } from "./auth-context"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number // ✅ Added stock
}

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from local storage when user changes
  useEffect(() => {
    const cartKey = user?.id ? `cart_${user.id}` : 'cart_guest'
    const stored = localStorage.getItem(cartKey)
    if (stored) {
      try {
        const parsedItems: CartItem[] = JSON.parse(stored)
        setItems(parsedItems)

        getAllProducts().then((response) => {
          if (response.success) {
            setItems((currentItems) => {
              return currentItems.map(item => {
                const freshProduct = response.data.find((p: any) => p._id === item.id);
                if (freshProduct) {
                  // Validate stock if item exists
                  const newQuantity = Math.min(item.quantity, freshProduct.stock || 0);
                  return {
                    ...item,
                    price: freshProduct.price,
                    stock: freshProduct.stock,
                    quantity: newQuantity
                  };
                }
                return item; // Keep item if not found (or maybe remove it?)
              }).filter(item => item.quantity > 0); // Remove items that became 0 quantity
            });
          }
        });

      } catch (error) {
        console.error("Failed to load cart:", error)
      }
    } else {
      setItems([])
    }
  }, [user?.id])

  // Save cart to localStorage
  useEffect(() => {
    const cartKey = user?.id ? `cart_${user.id}` : 'cart_guest'
    localStorage.setItem(cartKey, JSON.stringify(items))
  }, [items, user?.id])

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      const stockLimit = product.stock ?? 0;

      if (existing) {
        // ✅ Check stock limit
        if (existing.quantity >= stockLimit) {
          toast.error(`Only ${stockLimit} items available in stock`)
          // Update item details even if we can't add more (sync price/stock)
          return prev.map((item) => (item.id === product.id ? { ...item, ...product, quantity: item.quantity } : item))
        }
        // ✅ Update quantity AND refresh item details (important for syncing stock/price updates)
        return prev.map((item) => (item.id === product.id ? { ...item, ...product, quantity: item.quantity + 1 } : item))
      }

      // ✅ Check if initial add is possible (should always be unless stock is 0)
      if (stockLimit <= 0) {
        toast.error("Product is out of stock")
        return prev
      }

      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prev) => {
      return prev.map((item) => {
        if (item.id === productId) {
          // ✅ Check stock limit during update
          const stockLimit = item.stock ?? 0;

          if (quantity > stockLimit) {
            toast.error(`Only ${stockLimit} items available in stock`)
            return { ...item, quantity: stockLimit } // Cap at max stock
          }
          return { ...item, quantity }
        }
        return item
      })
    })
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.length // ✅ Show unique products count

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

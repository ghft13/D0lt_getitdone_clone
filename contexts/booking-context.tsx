"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Booking, BookingStatus, OrderData } from "@/lib/db-types"

export interface BookingWithDetails extends Booking {
  service_title?: string
  service_description?: string
  provider_name?: string
  user_name?: string
  user_email?: string
  otp?: string  // Added for OTP support in updates
}

export interface OrderWithDetails extends OrderData {
  booking?: BookingWithDetails  // Optional link to related booking
  user_id?: string  // Added for filtering in getUserOrders
}

interface BookingContextType {
  bookings: BookingWithDetails[]
  addBooking: (booking: BookingWithDetails) => void
  updateBooking: (bookingId: string, updates: Partial<BookingWithDetails>) => void
  cancelBooking: (bookingId: string) => void
  getBookingById: (bookingId: string) => BookingWithDetails | undefined
  getUserBookings: (userId: string) => BookingWithDetails[]
  getProviderBookings: (providerId: string) => BookingWithDetails[]

  // Added for orders management
  orders: OrderWithDetails[]
  addOrder: (order: OrderWithDetails) => void
  updateOrder: (orderId: string, updates: Partial<OrderWithDetails>) => void
  getOrderById: (orderId: string) => OrderWithDetails | undefined
  getUserOrders: (userId: string) => OrderWithDetails[]
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [orders, setOrders] = useState<OrderWithDetails[]>([])

  // Load bookings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("bookings")
    if (stored) {
      try {
        setBookings(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load bookings:", error)
      }
    }
  }, [])

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings))
  }, [bookings])

  // Load orders from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("orders")
    if (stored) {
      try {
        setOrders(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load orders:", error)
      }
    }
  }, [])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  const addBooking = (booking: BookingWithDetails) => {
    setBookings((prev) => [...prev, booking])
  }

  const updateBooking = (bookingId: string, updates: Partial<BookingWithDetails>) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, ...updates, updated_at: new Date().toISOString() } : booking,
      ),
    )
  }

  const cancelBooking = (bookingId: string) => {
    updateBooking(bookingId, { status: "cancelled" as BookingStatus })
  }

  const getBookingById = (bookingId: string) => {
    return bookings.find((b) => b.id === bookingId)
  }

  const getUserBookings = (userId: string) => {
    return bookings.filter((b) => b.user_id === userId)
  }

  const getProviderBookings = (providerId: string) => {
    return bookings.filter((b) => b.provider_id === providerId || b.providerId === providerId)
  }

  // Added order functions
  const addOrder = (order: OrderWithDetails) => {
    setOrders((prev) => [...prev, order])
  }

  const updateOrder = (orderId: string, updates: Partial<OrderWithDetails>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, ...updates, updated_at: new Date().toISOString() } : order,
      ),
    )
  }

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId)
  }

  const getUserOrders = (userId: string) => {
    return orders.filter((o) => (o.user_id || o.homeownerId) === userId)
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBooking,
        cancelBooking,
        getBookingById,
        getUserBookings,
        getProviderBookings,
        orders,
        addOrder,
        updateOrder,
        getOrderById,
        getUserOrders,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider")
  }
  return context
}

// Added missing useOrders hook
export function useOrders() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within a BookingProvider")
  }
  return {
    orders: context.orders,
    addOrder: context.addOrder,
    updateOrder: context.updateOrder,
    getOrderById: context.getOrderById,
    getUserOrders: context.getUserOrders,
  }
}
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Booking } from "@/lib/db-types"

export interface BookingWithDetails extends Booking {
  service_title?: string
  service_description?: string
  provider_name?: string
  user_name?: string
  user_email?: string
}

interface BookingContextType {
  bookings: BookingWithDetails[]
  addBooking: (booking: BookingWithDetails) => void
  updateBooking: (bookingId: string, updates: Partial<BookingWithDetails>) => void
  cancelBooking: (bookingId: string) => void
  getBookingById: (bookingId: string) => BookingWithDetails | undefined
  getUserBookings: (userId: string) => BookingWithDetails[]
  getProviderBookings: (providerId: string) => BookingWithDetails[]
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])

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
    updateBooking(bookingId, { status: "cancelled" })
  }

  const getBookingById = (bookingId: string) => {
    return bookings.find((b) => b.id === bookingId)
  }

  const getUserBookings = (userId: string) => {
    return bookings.filter((b) => b.user_id === userId)
  }

  const getProviderBookings = (providerId: string) => {
    return bookings.filter((b) => b.provider_id === providerId)
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

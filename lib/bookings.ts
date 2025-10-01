// Booking management utilities

import type { Booking, Service } from "./db-types"
import type { Coordinates } from "./geolocation"

export interface BookingFormData {
  serviceId: string
  scheduledDate: string
  address: string
  coordinates?: Coordinates
  notes?: string
}

export interface BookingWithDetails extends Booking {
  service?: Service
  provider_name?: string
  user_name?: string
}

// Mock bookings data
const mockBookings: BookingWithDetails[] = []

export async function createBooking(userId: string, formData: BookingFormData, servicePrice: number): Promise<Booking> {
  // TODO: Replace with actual database insert
  const booking: Booking = {
    id: `booking-${Date.now()}`,
    user_id: userId,
    provider_id: undefined,
    service_id: formData.serviceId,
    status: "pending",
    scheduled_date: formData.scheduledDate,
    completed_date: undefined,
    address: formData.address,
    latitude: formData.coordinates?.latitude,
    longitude: formData.coordinates?.longitude,
    notes: formData.notes,
    total_amount: servicePrice,
    currency: "USD",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockBookings.push(booking)
  return booking
}

export async function getUserBookings(userId: string): Promise<BookingWithDetails[]> {
  // TODO: Replace with actual database query
  return mockBookings.filter((b) => b.user_id === userId)
}

export async function getProviderBookings(providerId: string): Promise<BookingWithDetails[]> {
  // TODO: Replace with actual database query
  return mockBookings.filter((b) => b.provider_id === providerId)
}

export async function updateBookingStatus(bookingId: string, status: Booking["status"]): Promise<void> {
  // TODO: Replace with actual database update
  const booking = mockBookings.find((b) => b.id === bookingId)
  if (booking) {
    booking.status = status
    booking.updated_at = new Date().toISOString()
  }
}

export async function assignProvider(bookingId: string, providerId: string): Promise<void> {
  // TODO: Replace with actual database update
  const booking = mockBookings.find((b) => b.id === bookingId)
  if (booking) {
    booking.provider_id = providerId
    booking.status = "confirmed"
    booking.updated_at = new Date().toISOString()
  }
}

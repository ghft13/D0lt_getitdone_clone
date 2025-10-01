"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { useBookings } from "@/contexts/booking-context"
import { getCurrentLocation, geocodeAddress, type Coordinates } from "@/lib/geolocation"
import { getServiceById } from "@/lib/services"
import { MapPin, Calendar, FileText } from "lucide-react"

export default function BookServicePage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { addBooking } = useBookings()
  const [service, setService] = useState<ReturnType<typeof getServiceById>>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>()

  const [formData, setFormData] = useState({
    address: "",
    city: "Buenos Aires",
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/services/${params.id}/book`)
      return
    }

    const foundService = getServiceById(params.id as string)
    if (foundService) {
      setService(foundService)
    } else {
      router.push("/services")
    }
  }, [isAuthenticated, params.id, router])

  const handleUseCurrentLocation = async () => {
    setIsLoading(true)
    setError("")

    try {
      const coords = await getCurrentLocation()
      setCoordinates(coords)
      setUseCurrentLocation(true)

      setFormData((prev) => ({
        ...prev,
        address: `Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}`,
      }))
    } catch (err) {
      setError("Unable to get your location. Please enter your address manually.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!user || !service) return

    try {
      let bookingCoords = coordinates

      if (!useCurrentLocation && formData.address) {
        const location = await geocodeAddress(formData.address)
        bookingCoords = location.coordinates
      }

      const booking = {
        id: `booking-${Date.now()}`,
        user_id: user.id,
        provider_id: undefined,
        service_id: service.id,
        status: "pending" as const,
        scheduled_date: `${formData.scheduledDate}T${formData.scheduledTime}`,
        completed_date: undefined,
        address: formData.address,
        latitude: bookingCoords?.latitude,
        longitude: bookingCoords?.longitude,
        notes: formData.notes,
        total_amount: service.base_price,
        currency: service.currency,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        service_title: service.title,
        service_description: service.description,
        user_name: user.name,
        user_email: user.email,
      }

      addBooking(booking)

      // Redirect to payment
      router.push(`/booking/${booking.id}/payment`)
    } catch (err) {
      setError("Failed to create booking. Please try again.")
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">
              Book <span className="text-[#FF6B35]">{service.title}</span>
            </h1>
            <p className="text-neutral-600">{service.description}</p>
            <div className="mt-4 text-3xl font-bold text-[#FF6B35]">
              ${service.base_price} {service.currency}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">{error}</div>
            )}

            {/* Location Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#FF6B35]" />
                <h2 className="text-xl font-bold">Service Location</h2>
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLoading}
                  className="px-6 py-3 border-2 border-[#FF6B35] text-[#FF6B35] font-medium rounded-full transition-all duration-300 hover:bg-[#FF6B35]/10 disabled:opacity-50"
                >
                  {isLoading ? "Getting location..." : "Use Current Location"}
                </button>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Enter your service address"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Schedule Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-[#FF6B35]" />
                <h2 className="text-xl font-bold">Schedule Service</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="scheduledDate"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="scheduledTime" className="block text-sm font-medium mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    id="scheduledTime"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#FF6B35]" />
                <h2 className="text-xl font-bold">Additional Notes</h2>
              </div>

              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any special instructions or details about the service needed..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 outline-none transition-all resize-none"
              />
            </div>

            {/* Summary */}
            <div className="bg-neutral-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Service:</span>
                  <span className="font-medium">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Base Price:</span>
                  <span className="font-medium">
                    ${service.base_price} {service.currency}
                  </span>
                </div>
                <div className="border-t border-neutral-300 pt-2 mt-2 flex justify-between">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-[#FF6B35]">
                    ${service.base_price} {service.currency}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 bg-[#FF6B35] text-white font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Continue to Payment"}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

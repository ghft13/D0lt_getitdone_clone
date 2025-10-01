"use client"
import { useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import { CheckCircle, Calendar, MapPin, DollarSign } from "lucide-react"
import { useBookings } from "@/contexts/booking-context"
import { format } from "date-fns"

export default function BookingSuccessPage() {
  const params = useParams()
  const { getBookingById } = useBookings()
  const booking = getBookingById(params.id as string)

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Booking <span className="text-[#FF6B35]">Confirmed!</span>
            </h1>

            <p className="text-lg text-neutral-600 mb-8">
              Your service has been booked successfully. We're matching you with the best provider in your area.
            </p>

            {booking && (
              <div className="bg-neutral-50 rounded-xl p-6 mb-8 text-left">
                <div className="text-sm text-neutral-600 mb-4 text-center">Booking Details</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-600">Service</div>
                      <div className="font-medium">{booking.service_title}</div>
                    </div>
                  </div>
                  {booking.scheduled_date && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#FF6B35]" />
                      </div>
                      <div>
                        <div className="text-xs text-neutral-600">Scheduled</div>
                        <div className="font-medium">
                          {format(new Date(booking.scheduled_date), "MMM dd, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-600">Location</div>
                      <div className="font-medium">{booking.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-600">Total Paid</div>
                      <div className="font-medium">
                        ${booking.total_amount} {booking.currency}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-neutral-50 rounded-xl p-6 mb-8">
              <div className="text-sm text-neutral-600 mb-2">Booking ID</div>
              <div className="font-mono font-bold text-lg">{params.id}</div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                You will receive a confirmation email shortly with your booking details and assigned provider
                information.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/user/bookings"
                  className="px-8 py-3 bg-[#FF6B35] text-white font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105"
                >
                  View My Bookings
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-3 border-2 border-[#FF6B35] text-[#FF6B35] font-medium rounded-full transition-all duration-300 hover:bg-[#FF6B35]/10"
                >
                  Book Another Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

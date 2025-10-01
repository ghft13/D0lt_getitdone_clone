"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { useBookings } from "@/contexts/booking-context"
import { CreditCard, Building2, Loader2, Smartphone, Wallet, Bitcoin } from "lucide-react"

type PaymentGateway = "stripe" | "razorpay" | "gpay" | "paypal" | "crypto"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { getBookingById, updateBooking } = useBookings()
  const [booking, setBooking] = useState<ReturnType<typeof getBookingById>>()
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("stripe")
  const [selectedCrypto, setSelectedCrypto] = useState<"bitcoin" | "ethereum">("bitcoin")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const bookingData = getBookingById(params.id as string)
    if (!bookingData) {
      router.push("/dashboard/user/bookings")
      return
    }
    setBooking(bookingData)
  }, [isAuthenticated, params.id, router, getBookingById])

  const handlePayment = async () => {
    if (!booking) return

    setIsProcessing(true)
    setError("")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2500))

      updateBooking(booking.id, {
        status: "confirmed",
        payment_method: selectedGateway,
        payment_status: "paid",
      })

      router.push(`/booking/${params.id}/success`)
    } catch (err) {
      console.error("[v0] Payment error:", err)
      setError("Payment processing failed. Please try again.")
      setIsProcessing(false)
    }
  }

  if (!booking) {
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              Complete <span className="text-[#FF6B35]">Payment</span>
            </h1>
            <p className="text-neutral-600">Choose your preferred payment method</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">{error}</div>
            )}

            <h2 className="text-xl font-bold mb-6">Select Payment Gateway</h2>

            <div className="space-y-4 mb-8">
              {/* Stripe */}
              <button
                onClick={() => setSelectedGateway("stripe")}
                disabled={isProcessing}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedGateway === "stripe"
                    ? "border-[#FF6B35] bg-[#FF6B35]/5"
                    : "border-neutral-300 hover:border-neutral-400"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="w-8 h-8 text-[#FF6B35]" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Stripe</div>
                    <div className="text-sm text-neutral-600">Credit/Debit Card, Apple Pay, Google Pay</div>
                  </div>
                </div>
              </button>

              {/* Razorpay */}
              <button
                onClick={() => setSelectedGateway("razorpay")}
                disabled={isProcessing}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedGateway === "razorpay"
                    ? "border-[#FF6B35] bg-[#FF6B35]/5"
                    : "border-neutral-300 hover:border-neutral-400"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-4">
                  <Building2 className="w-8 h-8 text-[#FF6B35]" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Razorpay</div>
                    <div className="text-sm text-neutral-600">UPI, Cards, Net Banking, Wallets</div>
                  </div>
                </div>
              </button>

              {/* Google Pay */}
              <button
                onClick={() => setSelectedGateway("gpay")}
                disabled={isProcessing}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedGateway === "gpay"
                    ? "border-[#FF6B35] bg-[#FF6B35]/5"
                    : "border-neutral-300 hover:border-neutral-400"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-4">
                  <Smartphone className="w-8 h-8 text-[#FF6B35]" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Google Pay</div>
                    <div className="text-sm text-neutral-600">Fast & secure mobile payments</div>
                  </div>
                </div>
              </button>

              {/* PayPal */}
              <button
                onClick={() => setSelectedGateway("paypal")}
                disabled={isProcessing}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedGateway === "paypal"
                    ? "border-[#FF6B35] bg-[#FF6B35]/5"
                    : "border-neutral-300 hover:border-neutral-400"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-4">
                  <Wallet className="w-8 h-8 text-[#FF6B35]" />
                  <div className="text-left">
                    <div className="font-bold text-lg">PayPal</div>
                    <div className="text-sm text-neutral-600">Pay with your PayPal account</div>
                  </div>
                </div>
              </button>

              {/* Cryptocurrency */}
              <button
                onClick={() => setSelectedGateway("crypto")}
                disabled={isProcessing}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedGateway === "crypto"
                    ? "border-[#FF6B35] bg-[#FF6B35]/5"
                    : "border-neutral-300 hover:border-neutral-400"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-4">
                  <Bitcoin className="w-8 h-8 text-[#FF6B35]" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Cryptocurrency</div>
                    <div className="text-sm text-neutral-600">Bitcoin, Ethereum, and more</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Crypto Selection */}
            {selectedGateway === "crypto" && (
              <div className="mb-8 p-4 bg-neutral-50 rounded-xl">
                <h3 className="font-bold mb-4">Select Cryptocurrency</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedCrypto("bitcoin")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCrypto === "bitcoin"
                        ? "border-[#FF6B35] bg-white"
                        : "border-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    <div className="font-bold">Bitcoin (BTC)</div>
                    <div className="text-sm text-neutral-600">≈ 0.0032 BTC</div>
                  </button>
                  <button
                    onClick={() => setSelectedCrypto("ethereum")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCrypto === "ethereum"
                        ? "border-[#FF6B35] bg-white"
                        : "border-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    <div className="font-bold">Ethereum (ETH)</div>
                    <div className="text-sm text-neutral-600">≈ 0.065 ETH</div>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-neutral-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Service:</span>
                  <span className="font-medium">{booking.service_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Service Fee:</span>
                  <span className="font-medium">${booking.total_amount}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Processing Fee:</span>
                  <span className="font-medium">$5.00</span>
                </div>
                <div className="border-t border-neutral-300 pt-2 mt-2 flex justify-between">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-[#FF6B35]">
                    ${(booking.total_amount + 5).toFixed(2)} {booking.currency}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full px-8 py-4 bg-[#FF6B35] text-white font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ${
                  selectedGateway === "stripe"
                    ? "with Stripe"
                    : selectedGateway === "razorpay"
                      ? "with Razorpay"
                      : selectedGateway === "gpay"
                        ? "with Google Pay"
                        : selectedGateway === "paypal"
                          ? "with PayPal"
                          : `with ${selectedCrypto === "bitcoin" ? "Bitcoin" : "Ethereum"}`
                }`
              )}
            </button>

            <p className="text-xs text-neutral-500 text-center mt-4">
              🔒 Your payment is secure and encrypted. We never store your payment information.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">💡 Demo Mode</p>
            <p>
              This is a demonstration of the payment flow with multiple international gateways. All payments are
              simulated and no real transactions occur.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

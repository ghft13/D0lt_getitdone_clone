"use client"

import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CheckCircle, Package, Truck } from "lucide-react"

export default function CartSuccessPage() {
  const orderId = `ORD-${Date.now()}`

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Order <span className="text-[#FF6B35]">Confirmed!</span>
            </h1>

            <p className="text-lg text-neutral-600 mb-8">
              Thank you for your purchase! Your order has been successfully placed.
            </p>

            <div className="bg-neutral-50 rounded-xl p-6 mb-8">
              <div className="text-sm text-neutral-600 mb-2">Order ID</div>
              <div className="font-mono font-bold text-lg">{orderId}</div>
            </div>

            {/* Order Timeline */}
            <div className="mb-8">
              <div className="flex justify-center items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-medium">Order Placed</span>
                </div>
                <div className="w-16 h-0.5 bg-neutral-300" />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-2">
                    <Package className="w-6 h-6 text-neutral-400" />
                  </div>
                  <span className="text-xs font-medium text-neutral-600">Processing</span>
                </div>
                <div className="w-16 h-0.5 bg-neutral-300" />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-2">
                    <Truck className="w-6 h-6 text-neutral-400" />
                  </div>
                  <span className="text-xs font-medium text-neutral-600">Shipping</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                You will receive a confirmation email with tracking information once your order ships.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 bg-[#FF6B35] text-white font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105"
                >
                  View Dashboard
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-3 border-2 border-[#FF6B35] text-[#FF6B35] font-medium rounded-full transition-all duration-300 hover:bg-[#FF6B35]/10"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

import { NextResponse } from "next/server"
import { confirmPayment } from "@/lib/payments"
import { updateBookingStatus } from "@/lib/bookings"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transactionId, paymentMethod, bookingId } = body

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 })
    }

    const result = await confirmPayment(transactionId, paymentMethod)

    if (result.success && bookingId) {
      // Update booking status to confirmed
      await updateBookingStatus(bookingId, "confirmed")
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Payment confirmation error:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}

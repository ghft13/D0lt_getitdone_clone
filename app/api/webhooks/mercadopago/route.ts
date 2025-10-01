import { NextResponse } from "next/server"
import { updatePaymentStatus } from "@/lib/payments"
import { updateBookingStatus } from "@/lib/bookings"

export async function POST(request: Request) {
  try {
    // TODO: Verify Mercado Pago webhook signature
    const body = await request.json()

    console.log("[v0] Mercado Pago webhook received:", body.type)

    switch (body.type) {
      case "payment":
        // Fetch payment details
        // const mercadopago = require('mercadopago')
        // const payment = await mercadopago.payment.get(body.data.id)

        if (body.action === "payment.created" || body.action === "payment.updated") {
          const status = body.data.status

          if (status === "approved") {
            await updatePaymentStatus(body.data.id, "succeeded")

            // Update booking status
            if (body.data.metadata?.bookingId) {
              await updateBookingStatus(body.data.metadata.bookingId, "confirmed")
            }
          } else if (status === "rejected" || status === "cancelled") {
            await updatePaymentStatus(body.data.id, "failed")
          }
        }
        break

      default:
        console.log("[v0] Unhandled Mercado Pago event type:", body.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Mercado Pago webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { updatePaymentStatus } from "@/lib/payments"
import { updateBookingStatus } from "@/lib/bookings"

export async function POST(request: Request) {
  try {
    // TODO: Verify Stripe webhook signature
    // const signature = request.headers.get('stripe-signature')
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

    const body = await request.json()
    const event = body


    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        await updatePaymentStatus(paymentIntent.id, "succeeded")

        // Update booking status
        if (paymentIntent.metadata?.bookingId) {
          await updateBookingStatus(paymentIntent.metadata.bookingId, "confirmed")
        }
        break

      case "payment_intent.payment_failed":
        const failedIntent = event.data.object
        await updatePaymentStatus(failedIntent.id, "failed")
        break

      case "charge.refunded":
        const refund = event.data.object
        await updatePaymentStatus(refund.payment_intent, "refunded")
        break

      default:
     
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Stripe webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

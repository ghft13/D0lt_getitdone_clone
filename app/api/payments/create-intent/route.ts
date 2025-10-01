import { NextResponse } from "next/server"
import { createStripePaymentIntent, createMercadoPagoPreference } from "@/lib/payments"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookingId, amount, currency, gateway } = body

    if (!bookingId || !amount || !gateway) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let paymentIntent

    if (gateway === "stripe") {
      paymentIntent = await createStripePaymentIntent(bookingId, amount, currency || "USD")
    } else if (gateway === "mercadopago") {
      paymentIntent = await createMercadoPagoPreference(bookingId, amount, currency || "ARS")
    } else {
      return NextResponse.json({ error: "Invalid payment gateway" }, { status: 400 })
    }

    return NextResponse.json(paymentIntent)
  } catch (error) {
    console.error("[v0] Payment intent creation error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}

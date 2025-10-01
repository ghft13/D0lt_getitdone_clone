# Payment Integration Guide

## Overview

DOLT supports two payment gateways:
- **Stripe** - For international payments (credit cards, Apple Pay, Google Pay)
- **Mercado Pago** - Popular in Latin America

## Setup Instructions

### Stripe Integration

1. **Get API Keys**
   - Sign up at [stripe.com](https://stripe.com)
   - Get your API keys from the Dashboard
   - Add to environment variables:
     \`\`\`
     STRIPE_SECRET_KEY=sk_test_...
     STRIPE_PUBLISHABLE_KEY=pk_test_...
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
     \`\`\`

2. **Install Stripe SDK**
   \`\`\`bash
   npm install stripe @stripe/stripe-js
   \`\`\`

3. **Configure Webhooks**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Add webhook secret to env: `STRIPE_WEBHOOK_SECRET=whsec_...`

### Mercado Pago Integration

1. **Get API Keys**
   - Sign up at [mercadopago.com](https://www.mercadopago.com)
   - Get your access token from Developer settings
   - Add to environment variables:
     \`\`\`
     MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
     MERCADOPAGO_PUBLIC_KEY=APP_USR-...
     NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
     \`\`\`

2. **Install Mercado Pago SDK**
   \`\`\`bash
   npm install mercadopago
   \`\`\`

3. **Configure Webhooks**
   - Go to Mercado Pago Dashboard > Your integrations > Notifications
   - Add endpoint: `https://yourdomain.com/api/webhooks/mercadopago`
   - Select notification topics: `payment`

## Payment Flow

1. **User books a service** → Creates booking record
2. **User selects payment gateway** → Stripe or Mercado Pago
3. **Create payment intent** → API call to `/api/payments/create-intent`
4. **Process payment** → User completes payment with selected gateway
5. **Confirm payment** → API call to `/api/payments/confirm`
6. **Webhook updates** → Payment gateway sends webhook to update status
7. **Booking confirmed** → Booking status updated to "confirmed"

## API Endpoints

### POST /api/payments/create-intent
Creates a payment intent for the selected gateway.

**Request:**
\`\`\`json
{
  "bookingId": "booking-123",
  "amount": 15500,
  "currency": "USD",
  "gateway": "stripe"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "pi_123",
  "amount": 15500,
  "currency": "USD",
  "status": "pending",
  "clientSecret": "pi_123_secret_456"
}
\`\`\`

### POST /api/payments/confirm
Confirms a payment after successful processing.

**Request:**
\`\`\`json
{
  "transactionId": "pi_123",
  "paymentMethod": "card",
  "bookingId": "booking-123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "paymentId": "payment-123"
}
\`\`\`

### POST /api/webhooks/stripe
Handles Stripe webhook events.

**Events:**
- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Payment refunded

### POST /api/webhooks/mercadopago
Handles Mercado Pago webhook events.

**Events:**
- `payment.created` - Payment created
- `payment.updated` - Payment status updated

## Testing

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

### Mercado Pago Test Cards
- Success: `5031 7557 3453 0604`
- Decline: `5031 4332 1540 6351`

## Security

- All payment data is encrypted in transit
- We never store credit card information
- Webhook signatures are verified
- PCI compliance through payment gateways
- Row-level security on payment records

## Currency Support

- **Stripe**: USD, EUR, GBP, and 135+ currencies
- **Mercado Pago**: ARS, BRL, MXN, CLP, COP, PEN, UYU

## Refunds

Refunds can be processed through the admin dashboard or API:

\`\`\`typescript
import { refundPayment } from '@/lib/payments'

await refundPayment(paymentId, amount)
\`\`\`

## Production Checklist

- [ ] Replace test API keys with production keys
- [ ] Configure production webhook endpoints
- [ ] Test webhook signature verification
- [ ] Enable 3D Secure for Stripe
- [ ] Set up payment failure notifications
- [ ] Configure automatic retry logic
- [ ] Add payment analytics tracking
- [ ] Test refund process
- [ ] Review PCI compliance requirements

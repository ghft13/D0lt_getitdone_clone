// TypeScript types for database tables
// These match the SQL schema and can be used throughout the application

export type UserRole = "admin" | "provider" | "owner" | "manager" | "user"

export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"

export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "refunded"

export type PaymentGateway = "stripe" | "mercadopago" | "razorpay" | "gpay" | "paypal" | "crypto"

export type ContactStatus = "open" | "closed" | "pending" | "resolved"

export interface User {
  id: string
  email: string
  password_hash: string
  full_name: string
  phone?: string
  role: UserRole
  latitude?: number
  longitude?: number
  address?: string
  city?: string
  country?: string
  is_active: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  description?: string
  owner_id: string
  address?: string
  city?: string
  country?: string
  phone?: string
  email?: string
  latitude?: number
  longitude?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Provider {
  id: string
  user_id: string
  company_id?: string
  specialization: string[]
  bio?: string
  years_experience?: number
  certifications?: string[]
  service_radius_km: number
  latitude?: number
  longitude?: number
  rating: number
  total_reviews: number
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  category: string
  base_price: number
  currency: string
  duration_minutes?: number
  icon?: string
  features?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  provider_id?: string
  service_id: string
  status: BookingStatus
  scheduled_date?: string
  completed_date?: string
  address: string
  latitude?: number
  longitude?: number
  notes?: string
  total_amount: number
  currency: string
  payment_method?: string
  payment_status?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  booking_id: string
  gateway: PaymentGateway
  transaction_id: string
  amount: number
  currency: string
  status: PaymentStatus
  payment_method?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: ContactStatus
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  booking_id: string
  user_id: string
  provider_id: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
}

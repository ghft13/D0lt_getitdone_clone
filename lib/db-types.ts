export type UserRole = "admin" | "provider" | "owner" | "manager" | "user";

export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "assigned" | "accepted" | "completion_requested";

export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "refunded";

export type PaymentGateway = "stripe" | "mercadopago" | "razorpay" | "gpay" | "paypal" | "crypto";

export type ContactStatus = "open" | "closed" | "pending" | "resolved";

export type Permission = "manage_bookings" | "view_payments" | "manage_users" | "manage_providers" | "manage_contacts" | "manage_settings";

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  country?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  user_id: string;
  company_id?: string;
  specialization: string[];
  bio?: string;
  years_experience?: number;
  certifications?: string[];
  service_radius_km: number;
  latitude?: number;
  longitude?: number;
  rating: number;
  total_reviews: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  name?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  base_price: number;
  currency: string;
  duration_minutes?: number;
  icon?: string;
  features?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  provider_id?: string;
  service_id: string;
  status: BookingStatus;
  scheduled_date?: string;
  completed_date?: string;
  address?: {
    street: string;
    city: string;
  } | string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  total_amount: number;
  currency: string;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
  providerId?: string;
  homeownerId?: string;
  price?: number;
  preferredDateTime?: string | Date;
  transactionId?: string;
  otp?: string;
  rating?: number;
  service?: {
    name: string;
    title?: string;
    description: string;
  };
  homeowner?: {
    name: string;
    email: string;
  };
  provider?: {
    name: string;
  };
  history?: Array<{
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  gateway: PaymentGateway;
  transaction_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  total_amount?: number;
  items?: Array<{
    id: string;
    quantity: number;
    price: number;
    product?: { name: string };
  }>;
  homeownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  provider_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: string;
  contact_id: string;
  user_id?: string;
  messages: Array<{ sender_id: string; content: string; timestamp: string }>;
  created_at: string;
  updated_at: string;
}

export interface ChatSettings {
  id: string;
  autoReplyMessage?: string;
  retentionDays?: number;
  created_at: string;
  updated_at: string;
}

export interface GeneralSettings {
  id: string;
  siteName: string;
  description: string;
  defaultCurrency: string;
  supportEmail: string;
  supportPhone: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentGatewaySettings {
  id: string;
  gateway: PaymentGateway;
  apiKey: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoleSettings {
  id: string;
  role: UserRole;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface ContactSettings {
  id: string;
  allowedStatuses: ContactStatus[];
  autoReplyMessage?: string;
  created_at: string;
  updated_at: string;
}

export type BookingData = Booking;
export type OrderData = Payment;
export interface ExtendedAuthUser extends User {
  token?: string;
  company_id?: string;
}
export type ProviderData = Provider;
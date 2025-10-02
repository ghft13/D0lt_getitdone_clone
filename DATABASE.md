# DOLT Platform Database Schema

## Overview

This document describes the database schema for the DOLT maintenance platform. The schema is designed to support role-based access control, geolocation-based provider matching, booking management, and payment processing.

## Tables


### users
Stores all user accounts with role-based access control.

**Roles:**
- `admin` - Full system access, can manage all users and data
- `provider` - Service providers who fulfill bookings
- `owner` - Company owners who manage providers
- `manager` - Company managers with limited admin access
- `user` - Regular customers who book services

**Key Fields:**
- `latitude`, `longitude` - For geolocation-based provider matching
- `role` - Determines dashboard access and permissions
- `email_verified` - Email verification status

### companies
Stores company information for owner/manager accounts.

**Purpose:**
- Allows business owners to manage multiple providers
- Tracks company-level information and location

### providers
Extended profile for users with the `provider` role.

**Key Fields:**
- `specialization` - Array of service categories they handle
- `service_radius_km` - Maximum distance they'll travel (default 25km)
- `rating` - Average rating from reviews
- `is_available` - Current availability status

### services
Catalog of available maintenance services.

**Key Fields:**
- `category` - Service type (HVAC, Plumbing, Electrical, etc.)
- `base_price` - Starting price in specified currency
- `features` - Array of included features
- `is_active` - Whether service is currently offered

### bookings
Links users, providers, and services together.

**Status Flow:**
1. `pending` - Initial booking created
2. `confirmed` - Provider assigned and confirmed
3. `in_progress` - Service being performed
4. `completed` - Service finished
5. `cancelled` - Booking cancelled

**Key Fields:**
- `latitude`, `longitude` - Service location for provider matching
- `total_amount` - Final price including any adjustments

### payments
Tracks all payment transactions.

**Supported Gateways:**
- `stripe` - Credit cards, Apple Pay, Google Pay
- `mercadopago` - Popular in Latin America

**Status Flow:**
1. `pending` - Payment initiated
2. `processing` - Payment being processed
3. `succeeded` - Payment completed successfully
4. `failed` - Payment failed
5. `refunded` - Payment refunded to customer

### contacts
Stores contact form submissions from the website.

**Status Flow:**
1. `new` - Just submitted
2. `read` - Admin has viewed
3. `responded` - Admin has responded
4. `archived` - Closed/archived

### reviews
Customer reviews and ratings for providers.

**Key Fields:**
- `rating` - 1-5 star rating
- `comment` - Optional text review

## Geolocation Matching

The system uses latitude/longitude coordinates to match users with nearby providers:

1. Users provide their location when booking
2. System finds providers within their `service_radius_km`
3. Providers see nearby booking requests in their dashboard

**Distance Calculation:**
Use the Haversine formula or PostGIS extensions for accurate distance calculations.

## Row Level Security (RLS)

All tables have RLS policies to ensure data security:

- Users can only view/edit their own data
- Providers can view their assigned bookings
- Admins have full access to all data
- Services are publicly viewable

## Setup Instructions

1. Run scripts in order:
   - `01-create-tables.sql` - Creates all tables and indexes
   - `02-seed-data.sql` - Adds default admin and sample data
   - `03-row-level-security.sql` - Applies security policies

2. Default admin credentials:
   - Email: `admin@dolt.com`
   - Password: `D0LTadmin`

3. Test accounts included:
   - Provider: `provider@dolt.com`
   - User: `user@dolt.com`

## Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE` for proper timezone handling
- UUIDs are used for all primary keys
- Automatic `updated_at` triggers keep modification times current
- Foreign keys use appropriate CASCADE/SET NULL behaviors
- Indexes are created on frequently queried columns

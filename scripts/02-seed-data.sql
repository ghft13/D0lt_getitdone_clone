-- Seed data for DOLT Platform
-- Includes default admin account, sample services, and test data

-- Insert default admin account
-- Username: ADMIN
-- Password: D0LTadmin (this should be hashed in production)
-- Note: In production, use proper password hashing (bcrypt, argon2, etc.)
INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified)
VALUES (
  'admin@dolt.com',
  '$2a$10$rKZqYvM8N5xH5qJ5qJ5qJeO5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ', -- This is a placeholder hash for 'D0LTadmin'
  'ADMIN',
  'admin',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample services
INSERT INTO services (title, description, category, base_price, currency, duration_minutes, icon, features) VALUES
(
  'HVAC Maintenance',
  'Complete heating, ventilation, and air conditioning services with IoT monitoring.',
  'HVAC',
  150.00,
  'USD',
  120,
  'Wind',
  ARRAY['24/7 Monitoring', 'Preventive Maintenance', 'Emergency Repairs']
),
(
  'Plumbing Services',
  'Professional plumbing solutions with leak detection and predictive maintenance.',
  'Plumbing',
  120.00,
  'USD',
  90,
  'Droplet',
  ARRAY['Leak Detection', 'Pipe Repairs', 'Water System Optimization']
),
(
  'Electrical Systems',
  'Expert electrical maintenance and smart home integration services.',
  'Electrical',
  180.00,
  'USD',
  120,
  'Zap',
  ARRAY['Safety Inspections', 'Smart Integration', 'Emergency Response']
),
(
  'IoT Installation',
  'Smart sensor installation and system integration for predictive maintenance.',
  'IoT',
  250.00,
  'USD',
  180,
  'Wifi',
  ARRAY['Sensor Installation', 'System Integration', 'Real-time Monitoring']
),
(
  'Preventive Maintenance',
  'Comprehensive maintenance plans to prevent costly breakdowns.',
  'Maintenance',
  200.00,
  'USD',
  150,
  'Shield',
  ARRAY['Regular Inspections', 'Predictive Analytics', 'Priority Support']
),
(
  'General Repairs',
  'All-purpose maintenance and repair services for homes and businesses.',
  'General',
  100.00,
  'USD',
  60,
  'Wrench',
  ARRAY['Quick Response', 'Expert Technicians', 'Quality Guarantee']
) ON CONFLICT DO NOTHING;

-- Insert sample provider user
INSERT INTO users (email, password_hash, full_name, phone, role, latitude, longitude, address, city, country, is_active, email_verified)
VALUES (
  'provider@dolt.com',
  '$2a$10$rKZqYvM8N5xH5qJ5qJ5qJeO5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ',
  'Juan Martinez',
  '+54 11 2345-6789',
  'provider',
  -34.6037,
  -58.3816,
  'Av. Corrientes 1234',
  'Buenos Aires',
  'Argentina',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert provider profile for the sample provider
INSERT INTO providers (user_id, specialization, bio, years_experience, certifications, service_radius_km, latitude, longitude, rating, is_available)
SELECT 
  id,
  ARRAY['HVAC', 'Electrical', 'IoT'],
  'Experienced technician specializing in HVAC systems and IoT integration with over 10 years of experience.',
  10,
  ARRAY['HVAC Certified', 'Electrical License', 'IoT Specialist'],
  25,
  -34.6037,
  -58.3816,
  4.8,
  true
FROM users WHERE email = 'provider@dolt.com'
ON CONFLICT DO NOTHING;

-- Insert sample regular user
INSERT INTO users (email, password_hash, full_name, phone, role, latitude, longitude, address, city, country, is_active, email_verified)
VALUES (
  'user@dolt.com',
  '$2a$10$rKZqYvM8N5xH5qJ5qJ5qJeO5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ5qJ',
  'Maria Rodriguez',
  '+54 11 3456-7890',
  'user',
  -34.6158,
  -58.4333,
  'Av. Santa Fe 2500',
  'Buenos Aires',
  'Argentina',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample company
INSERT INTO companies (name, description, owner_id, address, city, country, phone, email, latitude, longitude)
SELECT 
  'DOLT Services Argentina',
  'Leading maintenance service provider in Buenos Aires with cutting-edge IoT technology.',
  id,
  'Av. Libertador 5000',
  'Buenos Aires',
  'Argentina',
  '+54 11 4567-8901',
  'info@dolt.com.ar',
  -34.5731,
  -58.4501
FROM users WHERE email = 'admin@dolt.com'
ON CONFLICT DO NOTHING;

// Service data and utilities

export interface Service {
  id: string
  title: string
  description: string
  base_price: number
  currency: string
  category: string
  features: string[]
  icon: string
}

export const SERVICES: Service[] = [
  {
    id: "hvac",
    title: "HVAC Maintenance",
    description: "Complete heating, ventilation, and air conditioning services with IoT monitoring.",
    base_price: 150,
    currency: "USD",
    category: "Climate Control",
    features: ["24/7 Monitoring", "Preventive Maintenance", "Emergency Repairs"],
    icon: "wind",
  },
  {
    id: "plumbing",
    title: "Plumbing Services",
    description: "Professional plumbing solutions with leak detection and predictive maintenance.",
    base_price: 120,
    currency: "USD",
    category: "Water Systems",
    features: ["Leak Detection", "Pipe Repairs", "Water System Optimization"],
    icon: "droplet",
  },
  {
    id: "electrical",
    title: "Electrical Systems",
    description: "Expert electrical maintenance and smart home integration services.",
    base_price: 180,
    currency: "USD",
    category: "Electrical",
    features: ["Safety Inspections", "Smart Integration", "Emergency Response"],
    icon: "zap",
  },
  {
    id: "iot",
    title: "IoT Installation",
    description: "Smart sensor installation and system integration for predictive maintenance.",
    base_price: 250,
    currency: "USD",
    category: "Technology",
    features: ["Sensor Installation", "System Integration", "Real-time Monitoring"],
    icon: "wifi",
  },
  {
    id: "preventive",
    title: "Preventive Maintenance",
    description: "Comprehensive maintenance plans to prevent costly breakdowns.",
    base_price: 200,
    currency: "USD",
    category: "Maintenance",
    features: ["Regular Inspections", "Predictive Analytics", "Priority Support"],
    icon: "shield",
  },
  {
    id: "general",
    title: "General Repairs",
    description: "All-purpose maintenance and repair services for homes and businesses.",
    base_price: 100,
    currency: "USD",
    category: "General",
    features: ["Quick Response", "Expert Technicians", "Quality Guarantee"],
    icon: "wrench",
  },
]

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id)
}

export function getServicesByCategory(category: string): Service[] {
  return SERVICES.filter((s) => s.category === category)
}

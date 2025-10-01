// E-commerce product catalog

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: "smart-thermostat",
    name: "Smart Thermostat Pro",
    description: "WiFi-enabled thermostat with AI learning and energy optimization",
    price: 249,
    image: "/smart-thermostat.png",
    category: "Smart Home",
    inStock: true,
  },
  {
    id: "water-leak-sensor",
    name: "Water Leak Detector",
    description: "IoT sensor with instant alerts and automatic shutoff integration",
    price: 89,
    image: "/water-leak-sensor.jpg",
    category: "Safety",
    inStock: true,
  },
  {
    id: "air-purifier",
    name: "HEPA Air Purifier",
    description: "Medical-grade air filtration with smart monitoring",
    price: 399,
    image: "/modern-air-purifier.png",
    category: "Air Quality",
    inStock: true,
  },
  {
    id: "smart-lock",
    name: "Smart Door Lock",
    description: "Keyless entry with biometric and remote access",
    price: 199,
    image: "/smart-door-lock.png",
    category: "Security",
    inStock: true,
  },
  {
    id: "smoke-detector",
    name: "Smart Smoke Detector",
    description: "Connected smoke and CO detector with voice alerts",
    price: 129,
    image: "/smoke-detector.png",
    category: "Safety",
    inStock: true,
  },
  {
    id: "led-bulbs",
    name: "Smart LED Bulbs (4-Pack)",
    description: "Color-changing WiFi bulbs with voice control",
    price: 59,
    image: "/smart-led-bulbs.png",
    category: "Lighting",
    inStock: true,
  },
  {
    id: "security-camera",
    name: "Outdoor Security Camera",
    description: "4K camera with night vision and motion detection",
    price: 179,
    image: "/outdoor-security-camera.png",
    category: "Security",
    inStock: true,
  },
  {
    id: "smart-plug",
    name: "Smart Plug (2-Pack)",
    description: "WiFi plugs with energy monitoring and scheduling",
    price: 39,
    image: "/smart-plug.jpg",
    category: "Smart Home",
    inStock: true,
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category)
}

export const PRODUCT_CATEGORIES = ["All", "Smart Home", "Safety", "Security", "Air Quality", "Lighting"]

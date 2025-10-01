import FloatingNavbar from "@/components/floating-navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import { Wrench, Droplet, Zap, Wind, Wifi, Shield } from "lucide-react"
import ServiceMap from "@/components/service-map"
import ServiceSuggestions from "@/components/service-suggestions"
import ProductCatalog from "@/components/product-catalog"

export default function ServicesPage() {
  const services = [
    {
      id: "hvac",
      icon: Wind,
      title: "HVAC Maintenance",
      description: "Complete heating, ventilation, and air conditioning services with IoT monitoring.",
      price: "$150",
      features: ["24/7 Monitoring", "Preventive Maintenance", "Emergency Repairs"],
    },
    {
      id: "plumbing",
      icon: Droplet,
      title: "Plumbing Services",
      description: "Professional plumbing solutions with leak detection and predictive maintenance.",
      price: "$120",
      features: ["Leak Detection", "Pipe Repairs", "Water System Optimization"],
    },
    {
      id: "electrical",
      icon: Zap,
      title: "Electrical Systems",
      description: "Expert electrical maintenance and smart home integration services.",
      price: "$180",
      features: ["Safety Inspections", "Smart Integration", "Emergency Response"],
    },
    {
      id: "iot",
      icon: Wifi,
      title: "IoT Installation",
      description: "Smart sensor installation and system integration for predictive maintenance.",
      price: "$250",
      features: ["Sensor Installation", "System Integration", "Real-time Monitoring"],
    },
    {
      id: "preventive",
      icon: Shield,
      title: "Preventive Maintenance",
      description: "Comprehensive maintenance plans to prevent costly breakdowns.",
      price: "$200",
      features: ["Regular Inspections", "Predictive Analytics", "Priority Support"],
    },
    {
      id: "general",
      icon: Wrench,
      title: "General Repairs",
      description: "All-purpose maintenance and repair services for homes and businesses.",
      price: "$100",
      features: ["Quick Response", "Expert Technicians", "Quality Guarantee"],
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <FloatingNavbar />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Our <span className="text-[#FF6B35]">Services</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Professional maintenance solutions powered by IoT technology and expert technicians across Latin America.
            </p>
          </div>

          <div className="mb-12">
            <ServiceMap />
          </div>

          <div className="mb-12">
            <ServiceSuggestions />
          </div>

          {/* Services Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Available Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-[#FF6B35]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-neutral-600 mb-4 leading-relaxed">{service.description}</p>
                  <div className="text-3xl font-bold text-[#FF6B35] mb-4">{service.price}</div>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-neutral-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.id}/book`}
                    className="block w-full text-center px-6 py-3 bg-[#FF6B35] text-white font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105"
                  >
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <ProductCatalog />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

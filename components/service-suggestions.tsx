"use client"

import { Sparkles, TrendingUp, Clock, Award } from "lucide-react"
import Link from "next/link"

export default function ServiceSuggestions() {
  const suggestions = [
    {
      title: "Winter HVAC Check",
      description: "Get your heating system ready for winter with our comprehensive inspection",
      discount: "20% OFF",
      icon: Sparkles,
      color: "bg-blue-50 border-blue-200",
      link: "/services/hvac/book",
    },
    {
      title: "Smart Home Bundle",
      description: "IoT installation + 3 months monitoring at special price",
      discount: "Save $150",
      icon: TrendingUp,
      color: "bg-green-50 border-green-200",
      link: "/services/iot/book",
    },
    {
      title: "Emergency Service",
      description: "24/7 urgent repairs available in your area",
      discount: "Fast Response",
      icon: Clock,
      color: "bg-orange-50 border-orange-200",
      link: "/services",
    },
    {
      title: "Premium Maintenance",
      description: "Annual plan with priority support and free inspections",
      discount: "Best Value",
      icon: Award,
      color: "bg-purple-50 border-purple-200",
      link: "/services/preventive/book",
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-2xl font-bold mb-4">Recommended for You</h3>
      <p className="text-neutral-600 mb-6">Based on your location and popular services in your area</p>

      <div className="grid md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, index) => (
          <Link
            key={index}
            href={suggestion.link}
            className={`p-6 rounded-xl border-2 ${suggestion.color} hover:shadow-md transition-all group`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <suggestion.icon className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-lg">{suggestion.title}</h4>
                  <span className="px-3 py-1 bg-[#FF6B35] text-white text-xs font-bold rounded-full">
                    {suggestion.discount}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">{suggestion.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Sponsored Ad Section */}
      <div className="mt-6 p-6 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/5 rounded-xl border-2 border-[#FF6B35]/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-600 mb-1">SPONSORED</div>
            <h4 className="font-bold text-lg mb-2">Get 30% Off Your First Service</h4>
            <p className="text-sm text-neutral-600 mb-3">
              New customers get exclusive discount on any maintenance service
            </p>
            <button className="px-6 py-2 bg-[#FF6B35] text-white rounded-full font-medium hover:bg-[#ff5722] transition-colors">
              Claim Offer
            </button>
          </div>
          <div className="hidden md:block text-6xl">🎉</div>
        </div>
      </div>
    </div>
  )
}

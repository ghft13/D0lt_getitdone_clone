"use client"

import { useRef, useState } from "react"
import { MapPin, Navigation } from "lucide-react"

interface ServiceMapProps {
  userLocation?: { lat: number; lng: number }
  onLocationSelect?: (location: { lat: number; lng: number }) => void
}

export default function ServiceMap({ userLocation, onLocationSelect }: ServiceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedCity, setSelectedCity] = useState("Buenos Aires")

  // Popular service locations in Latin America
  const serviceLocations = [
    { name: "Buenos Aires", lat: -34.6037, lng: -58.3816, services: 45 },
    { name: "São Paulo", lat: -23.5505, lng: -46.6333, services: 38 },
    { name: "Mexico City", lat: 19.4326, lng: -99.1332, services: 52 },
    { name: "Lima", lat: -12.0464, lng: -77.0428, services: 28 },
    { name: "Bogotá", lat: 4.711, lng: -74.0721, services: 31 },
  ]

  const handleLocationClick = (location: { lat: number; lng: number; name: string }) => {
    setSelectedCity(location.name)
    onLocationSelect?.({ lat: location.lat, lng: location.lng })
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Service Coverage Map</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#ff5722] transition-colors">
          <Navigation className="w-4 h-4" />
          Use My Location
        </button>
      </div>

      {/* Interactive Map Visualization */}
      <div
        ref={mapRef}
        className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl overflow-hidden mb-4"
      >
        {/* Map Background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 800 400" className="w-full h-full">
            {/* Simplified Latin America outline */}
            <path
              d="M 400 50 Q 450 100 420 150 L 400 200 Q 380 250 400 300 L 420 350"
              stroke="#FF6B35"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Service Location Markers */}
        {serviceLocations.map((location, index) => (
          <button
            key={index}
            onClick={() => handleLocationClick(location)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
              selectedCity === location.name ? "z-10" : ""
            }`}
            style={{
              left: `${((location.lng + 100) / 200) * 100}%`,
              top: `${((90 - location.lat) / 180) * 100}%`,
            }}
          >
            <div className="relative">
              <MapPin
                className={`w-8 h-8 ${selectedCity === location.name ? "text-[#FF6B35]" : "text-blue-600"}`}
                fill={selectedCity === location.name ? "#FF6B35" : "#2563eb"}
              />
              <div
                className={`absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-xs font-medium ${
                  selectedCity === location.name ? "bg-[#FF6B35] text-white" : "bg-white text-neutral-800 shadow-md"
                }`}
              >
                {location.name}
              </div>
            </div>
          </button>
        ))}

        {/* Coverage Circles */}
        {serviceLocations.map((location, index) => (
          <div
            key={`circle-${index}`}
            className="absolute rounded-full border-2 border-[#FF6B35] opacity-20 animate-pulse"
            style={{
              left: `${((location.lng + 100) / 200) * 100}%`,
              top: `${((90 - location.lat) / 180) * 100}%`,
              width: "100px",
              height: "100px",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Location Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {serviceLocations.map((location, index) => (
          <button
            key={index}
            onClick={() => handleLocationClick(location)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedCity === location.name
                ? "border-[#FF6B35] bg-[#FF6B35]/5"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="font-bold text-sm">{location.name}</div>
            <div className="text-xs text-neutral-600">{location.services} providers</div>
          </button>
        ))}
      </div>
    </div>
  )
}

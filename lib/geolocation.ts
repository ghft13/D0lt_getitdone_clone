// Geolocation utilities for provider matching

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface LocationResult {
  address: string
  city: string
  country: string
  coordinates: Coordinates
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude)
  const dLon = toRadians(coord2.longitude - coord1.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Get user's current location using browser geolocation API
export async function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
    )
  })
}

// Mock geocoding function - in production, use Google Maps API or similar
export async function geocodeAddress(address: string): Promise<LocationResult> {
  // TODO: Implement actual geocoding with Google Maps API or similar
  // For now, return mock coordinates for Buenos Aires
  return {
    address,
    city: "Buenos Aires",
    country: "Argentina",
    coordinates: {
      latitude: -34.6037 + Math.random() * 0.1 - 0.05,
      longitude: -58.3816 + Math.random() * 0.1 - 0.05,
    },
  }
}

// Mock reverse geocoding function
export async function reverseGeocode(coordinates: Coordinates): Promise<LocationResult> {
  // TODO: Implement actual reverse geocoding
  return {
    address: "Sample Address, Buenos Aires",
    city: "Buenos Aires",
    country: "Argentina",
    coordinates,
  }
}

// Find providers within radius
export function findNearbyProviders<T extends { latitude?: number; longitude?: number; service_radius_km: number }>(
  userLocation: Coordinates,
  providers: T[],
  maxDistance?: number,
): Array<T & { distance: number }> {
  return providers
    .filter((provider) => provider.latitude && provider.longitude)
    .map((provider) => {
      const distance = calculateDistance(userLocation, {
        latitude: provider.latitude!,
        longitude: provider.longitude!,
      })
      return { ...provider, distance }
    })
    .filter((provider) => {
      const radius = maxDistance || provider.service_radius_km
      return provider.distance <= radius
    })
    .sort((a, b) => a.distance - b.distance)
}


import FloatingNavbar from "@/components/floating-navbar"
import Footer from "@/components/footer"

import ServiceMap from "@/components/service-map"
// import ServiceSuggestions from "@/components/service-suggestions"
import ProductCatalog from "@/components/product-catalog"
import { getAllServices } from "@/app/api/Service"
import BookNowButton from "@/components/BookNowButton";
export default async function ServicesPage() {


  const services = await getAllServices()

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
            {/* <ServiceSuggestions /> */}
          </div>

          {/* Services Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Available Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {services.map((service: any) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mb-6 text-3xl">
                    {service.icon}
                  </div>

                  {/* Title and Category */}
                  <h3 className="text-2xl font-bold mb-1">{service.name}</h3>
                  <p className="text-sm text-neutral-500 mb-3">{service.category}</p>

                  {/* Description */}
                  <p className="text-neutral-600 mb-4 leading-relaxed">{service.description}</p>

                  {/* Price */}
                  <div className="text-3xl font-bold text-[#FF6B35] mb-4">${service.basePrice}</div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="font-semibold">{service.rating}⭐</span>
                    <span className="text-sm text-neutral-500">({service.reviewCount} reviews)</span>
                  </div>

                  {/* Button */}
             <BookNowButton  />
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

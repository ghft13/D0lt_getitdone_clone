"use client"

import { useLanguage } from "@/contexts/language-context"
import FloatingNavbar from "@/components/floating-navbar"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Award, Users, CheckCircle, Network, Shield, Zap, Globe, HeartHandshake } from "lucide-react"

export default function WhyChooseDoltPage() {
  const { t } = useLanguage()

  const stats = [
    {
      icon: Award,
      number: "15+",
      title: t("yearsExperience"),
      description: t("yearsDesc"),
    },
    {
      icon: Users,
      number: "10,000+",
      title: t("satisfiedClients"),
      description: t("clientsDesc"),
    },
    {
      icon: CheckCircle,
      number: "50,000+",
      title: t("servicesCompleted"),
      description: t("servicesDesc"),
    },
    {
      icon: Network,
      number: "500+",
      title: t("technicianNetwork"),
      description: t("networkDesc"),
    },
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Guaranteed Quality",
      description: "All our technicians are certified professionals with extensive training and background checks.",
    },
    {
      icon: Zap,
      title: "Fast Response Time",
      description: "Average response time of 12 minutes for emergency services across all our service areas.",
    },
    {
      icon: Globe,
      title: "Pan-Latin America Coverage",
      description: "Operating in 15 countries with local teams that understand your specific needs.",
    },
    {
      icon: HeartHandshake,
      title: "Customer-First Approach",
      description: "24/7 support, transparent pricing, and satisfaction guarantee on every service.",
    },
  ]

  return (
    <main className="min-h-screen bg-neutral-50">
      <FloatingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#FF6B35] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF6B35] rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance">
              {t("whyChoose")} <span className="text-[#FF6B35]">{t("dolt")}</span>
            </h1>
            <p className="text-neutral-300 text-xl max-w-3xl mx-auto leading-relaxed">{t("highlightsDescription")}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#FF6B35]/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mb-6">
                  <stat.icon className="w-8 h-8 text-[#FF6B35]" />
                </div>
                <div className="text-5xl font-bold text-white mb-3">{stat.number}</div>
                <h3 className="text-xl font-bold text-white mb-2">{stat.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-balance">
            What Sets Us <span className="text-[#FF6B35]">Apart</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mb-6">
                  <benefit.icon className="w-8 h-8 text-[#FF6B35]" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-neutral-600 leading-relaxed text-lg">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Powered by <span className="text-[#FF6B35]">Advanced Technology</span>
              </h2>
              <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                We leverage cutting-edge IoT sensors, predictive analytics, and machine learning to monitor your systems
                24/7. Our technology predicts potential issues before they become problems, saving you time and money.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FF6B35] flex-shrink-0 mt-1" />
                  <span className="text-neutral-700">Real-time monitoring with smart IoT sensors</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FF6B35] flex-shrink-0 mt-1" />
                  <span className="text-neutral-700">Predictive maintenance algorithms</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FF6B35] flex-shrink-0 mt-1" />
                  <span className="text-neutral-700">Mobile app for instant updates and control</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FF6B35] flex-shrink-0 mt-1" />
                  <span className="text-neutral-700">Automated scheduling and dispatch</span>
                </li>
              </ul>
            </div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden bg-neutral-200">
              <Image
                src="/modern-maintenance-technician-with-tablet-and-iot-.jpg"
                fill
                alt="Advanced maintenance technology"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#FF6B35] to-[#ff5722]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
            Ready to Experience the Difference?
          </h2>
          <p className="text-white/90 text-xl mb-8 leading-relaxed">
            Join thousands of satisfied customers across Latin America who trust DOLT for their maintenance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="px-8 py-4 bg-white text-[#FF6B35] text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {t("bookService")}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white text-lg font-medium rounded-full transition-all duration-300 hover:bg-white/10"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

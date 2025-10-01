"use client"

import Image from "next/image"
import Link from "next/link"
import { Wifi, Shield, Wrench, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Features() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Wifi,
      title: t("iotMonitoring"),
      description: t("iotDescription"),
    },
    {
      icon: Shield,
      title: t("predictiveTech"),
      description: t("predictiveDescription"),
    },
    {
      icon: Wrench,
      title: t("expertTechnicians"),
      description: t("expertsDescription"),
    },
    {
      icon: Clock,
      title: t("support247"),
      description: t("supportDescription"),
    },
  ]

  return (
    <section className="min-h-screen bg-neutral-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-balance">
          {t("smartMaintenance")} <span className="text-[#FF6B35]">{t("solutions")}</span>
        </h2>
        <p className="text-center text-neutral-600 text-lg mb-16 max-w-3xl mx-auto">{t("featuresDescription")}</p>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[#FF6B35]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="relative h-[500px] rounded-3xl overflow-hidden bg-neutral-200">
              <Image
                src="/modern-maintenance-technician-with-tablet-and-iot-.jpg"
                fill
                alt="Smart maintenance technology"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-8 right-8 bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-5xl font-bold text-[#FF6B35] mb-2">99.9%</div>
              <div className="text-neutral-600 font-medium">{t("uptimeGuarantee")}</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/services"
            className="inline-block px-8 py-4 bg-[#FF6B35] text-white text-base font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105"
          >
            {t("learnMoreServices")}
          </Link>
        </div>
      </div>
    </section>
  )
}

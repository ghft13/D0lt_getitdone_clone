"use client"
import Image from "next/image"
import Link from "next/link"
import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

export default function Hero() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "150vh"])
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  return (
    <div ref={container} className="h-screen overflow-hidden relative">
      <motion.div style={{ y }} className="relative h-full">
        <Image
          src="/images/mountain-landscape.jpg"
          fill
          alt="Mountain landscape background"
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        {!isAuthenticated && (
          <div className="absolute top-8 right-8 z-20 flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-white hover:text-[#FF6B35] transition-colors duration-300 text-sm font-medium"
            >
              {t("login")}
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-[#FF6B35] text-white rounded-full hover:bg-[#ff5722] transition-all duration-300 text-sm font-medium"
            >
              {t("signup")}
            </Link>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/60 backdrop-blur-sm rounded-3xl px-12 py-16 max-w-5xl mx-6">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
                <span className="text-[#FF6B35]">{t("heroTitle1")}</span>{" "}
                <span className="text-white">{t("heroTitle2")}</span>
                <br />
                <span className="text-[#FF6B35]">{t("heroTitle3")}</span>
                <br />
                <span className="text-white">{t("heroTitle4")}</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl leading-relaxed mb-10 max-w-3xl mx-auto text-neutral-200">
                {t("heroDescription")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/services"
                  className="px-8 py-3 bg-[#FF6B35] text-white text-base font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105"
                >
                  {t("bookService")}
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 border-2 border-[#FF6B35] text-[#FF6B35] text-base font-medium rounded-full transition-all duration-300 hover:bg-[#FF6B35]/10"
                >
                  {t("requestDemo")}
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-3 border-2 border-white text-white text-base font-medium rounded-full transition-all duration-300 hover:bg-white/10"
                >
                  {t("learnMore")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

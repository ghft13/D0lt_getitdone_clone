"use client"

import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <div
      className="relative h-[400px] sm:h-[600px] lg:h-[800px] max-h-[800px] bg-black"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+400px)] sm:h-[calc(100vh+600px)] lg:h-[calc(100vh+800px)] -top-[100vh]">
        <div className="h-[400px] sm:h-[600px] lg:h-[800px] sticky top-[calc(100vh-400px)] sm:top-[calc(100vh-600px)] lg:top-[calc(100vh-800px)] flex flex-col justify-between px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          
          {/* Main Content: Empty since no contact or FAQ */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
            
            {/* Left Side: Empty */}

          </div>

          {/* Branding and Copyright Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 mt-6">
            <div className="flex flex-col items-start">
              <h1 className="text-[18vw] sm:text-[16vw] lg:text-[14vw] leading-[0.8] text-white font-bold tracking-tight">
                {t("dolt")}
              </h1>
              <p className="text-white text-sm sm:text-base mt-2">Get IT Done</p>
            </div>
            <div className="text-right">
              <p className="text-[#FF6B35] text-sm sm:text-base mb-2">Smart Maintenance Solutions</p>
              <p className="text-neutral-400 text-sm sm:text-base">©2025 DOLT. All rights reserved.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
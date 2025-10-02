"use client";

import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <div
      className="relative h-[400px] sm:h-[600px] lg:h-[800px] max-h-[800px] bg-black"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+400px)] sm:h-[calc(100vh+600px)] lg:h-[calc(100vh+800px)] -top-[100vh]">
        <div className="h-[400px] sm:h-[600px] lg:h-[800px] sticky top-[calc(100vh-400px)] sm:top-[calc(100vh-600px)] lg:top-[calc(100vh-800px)] flex flex-col justify-end px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          
          {/* Links Section moved lower */}
<div className="flex justify-end items-start mb-16">
  <div className="absolute top-[65%] left-[60%] flex space-x-12 -translate-y-1/2">

    {/* Column 1 */}
    <div className="flex flex-col items-center space-y-1">
      <Link href="/privacy" className="text-white text-base hover:text-[#FF6B35]">Privacy Policy</Link>
      <Link href="/terms" className="text-white text-base hover:text-[#FF6B35]">Terms Conditions</Link>
      <Link href="/about" className="text-white text-base hover:text-[#FF6B35]">About Us</Link>
    </div>

    {/* Column 2 */}
    <div className="flex flex-col items-center space-y-1">
      <Link href="/services" className="text-white text-base hover:text-[#FF6B35]">Services</Link>
      <Link href="/contact" className="text-white text-base hover:text-[#FF6B35]">Contact</Link>
      <Link href="/home" className="text-white text-base hover:text-[#FF6B35]">Home</Link>
    </div>

    {/* Column 3 */}
    <div className="flex flex-col items-center space-y-1">
      <Link href="/policy" className="text-white text-base hover:text-[#FF6B35]">Policy</Link>
      <Link href="/trademark" className="text-white text-base hover:text-[#FF6B35]">Trademark</Link>
      <Link href="/whatsapp" className="text-white text-base hover:text-[#FF6B35]">WhatsApp</Link>
    </div>

    {/* Column 4 */}
    <div className="flex flex-col items-center space-y-1">
      <Link href="/faq" className="text-white text-base hover:text-[#FF6B35]">FAQ</Link>
      <Link href="/support" className="text-white text-base hover:text-[#FF6B35]">Support</Link>
      <Link href="/blog" className="text-white text-base hover:text-[#FF6B35]">Blog</Link>
    </div>
    

  </div>
</div>



          {/* Branding Section Pushed to Bottom */}
          <div className=" absolute bottom-0 grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-0 mt-auto pb-4">
            <div className="flex flex-col items-start col-span-1">
              <p className="text-white text-xl sm:text-2xl mt-4 ml-4">
                GET IT DONE
              </p>
              <h1 className="text-[18vw] sm:text-[16vw] lg:text-[14vw] leading-[0.8] text-white font-bold tracking-tight -mt-4 sm:-mt-6">
                {t("dolt")}
              </h1>
              <p className="text-[#FF6B35] text-sm sm:text-base ml-4 mt-1">
                Smart Maintenance Solutions
              </p>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="absolute bottom-0 left-0 w-full flex justify-center p-4">
            <p className="text-neutral-400 text-sm sm:text-base">
              ©2025 DOLT. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

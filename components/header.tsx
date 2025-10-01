"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart, User, ChevronDown } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount } = useCart()
  const [languageOpen, setLanguageOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  return (
    <header
      className={`${isHome ? "absolute" : "fixed"} bottom-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-sm border-t border-white/5 rounded-t-lg shadow-sm p-6`}
    >
      <div className="flex items-center gap-0">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="DOLT Logo"
            width={18}
            height={18}
            className="rounded-full"
          />
        </Link>
        <Link href="/home" className="text-white text-[8px] font-medium hover:text-[#FF6B35] transition-colors duration-300 whitespace-nowrap">
          Home
        </Link>
        <Link href="/services" className="text-white text-[8px] font-medium hover:text-[#FF6B35] transition-colors duration-300 whitespace-nowrap">
          Services
        </Link>
        <Link href="/about" className="text-white text-[8px] font-medium hover:text-[#FF6B35] transition-colors duration-300 whitespace-nowrap">
          About
        </Link>
        <Link href="/contact" className="text-white text-[8px] font-medium hover:text-[#FF6B35] transition-colors duration-300 whitespace-nowrap">
          Contact
        </Link>
        <div className="relative">
          <button
            onClick={() => setLanguageOpen(!languageOpen)}
            className="flex items-center gap-0 text-white text-[8px] font-medium hover:text-[#FF6B35] transition-colors duration-300 whitespace-nowrap"
          >
            EN<ChevronDown className="w-1.5 h-1.5" />
          </button>
          {languageOpen && (
            <div className="absolute bottom-3 right-0 bg-white/5 backdrop-blur-sm border border-white/5 rounded p-0.5 min-w-[50px] z-10 shadow-sm">
              <Link href="/language/en" className="block text-white text-[8px] hover:text-[#FF6B35] px-0.5 py-0.5 rounded">EN</Link>
              <Link href="/language/es" className="block text-white text-[8px] hover:text-[#FF6B35] px-0.5 py-0.5 rounded">ES</Link>
            </div>
          )}
        </div>
        <div className="relative flex items-center gap-0">
          <Link href="/cart" className="relative text-white hover:text-neutral-300 transition-colors duration-300">
            <ShoppingCart className="w-2 h-2" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#FF6B35] text-white text-[7px] font-bold rounded-full w-2 h-2 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-0 text-white text-[8px] font-medium hover:text-[#FF6B35] transition-colors duration-300 whitespace-nowrap"
              >
                <span className="text-neutral-400 text-[8px]">MR</span>
                <span className="text-white text-[8px] truncate max-w-10">{user?.full_name || "Maria R."}</span>
                <User className="w-2 h-2" />
                <ChevronDown className="w-1.5 h-1.5" />
              </button>
              {userOpen && (
                <div className="absolute bottom-3 right-0 bg-white/5 backdrop-blur-sm border border-white/5 rounded p-0.5 min-w-[70px] z-10 shadow-sm">
                  <Link href="/profile" className="block text-white text-[8px] hover:text-[#FF6B35] px-0.5 py-0.5 rounded">Profile</Link>
                  <button
                    onClick={logout}
                    className="block text-white text-[8px] hover:text-[#FF6B35] px-0.5 py-0.5 rounded w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-[#FF6B35] transition-colors duration-300 text-[8px] whitespace-nowrap">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-white text-neutral-900 px-0.5 py-0.5 rounded-full text-[8px] font-medium hover:bg-neutral-200 transition-colors duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
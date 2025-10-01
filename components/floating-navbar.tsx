"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function FloatingNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust threshold to hero height (e.g., 600px for hero section) - only for home
      if (isHome) {
        setIsScrolled(window.scrollY > 600);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowLangDropdown(false);
      setShowUserDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Position: On non-home pages, always top. On home, bottom initially, top after scroll
  const navbarPosition =
    isHome && !isScrolled
      ? "fixed bottom-8 left-1/2 -translate-x-1/2"
      : "fixed top-4 left-1/2 -translate-x-1/2";

  return (
    <nav
      className={`${navbarPosition} z-50 bg-black/90 backdrop-blur-md rounded-full px-3 py-2 transition-all duration-300 shadow-2xl border border-white/10`}
    >
      <div className="flex items-center justify-end gap-2">
        {" "}
        {/* Right-aligned, content-sized */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="images/logo/D_white.png" // Path to your logo image in /public folder
            alt="DOLT Logo"
            width={24} // Adjust width as needed
            height={24} // Adjust height as needed
            className="rounded-full"
          />
        </Link>
        <div className="flex items-center gap-2">
          {" "}
          {/* Reduced gap for compactness */}
          <Link
            href="/"
            className="text-white hover:text-[#FF6B35] transition-colors duration-300 text-xs font-medium"
          >
            {t("home")}
          </Link>
          <Link
            href="/services"
            className="text-white hover:text-[#FF6B35] transition-colors duration-300 text-xs font-medium"
          >
            {t("services")}
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-[#FF6B35] transition-colors duration-300 text-xs font-medium"
          >
            {t("about")}
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-[#FF6B35] transition-colors duration-300 text-xs font-medium"
          >
            {t("contact")}
          </Link>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLangDropdown(!showLangDropdown);
                setShowUserDropdown(false);
              }}
              className="flex items-center gap-0.5 px-2 py-1 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded-full text-xs font-medium transition-colors duration-300"
            >
              {language.toUpperCase()}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showLangDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-black/95 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-white/10 min-w-[100px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLanguage("en");
                    setShowLangDropdown(false);
                  }}
                  className="w-full px-2 py-2 text-left text-white hover:bg-[#FF6B35] transition-colors duration-200 text-xs"
                >
                  English
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLanguage("es");
                    setShowLangDropdown(false);
                  }}
                  className="w-full px-2 py-2 text-left text-white hover:bg-[#FF6B35] transition-colors duration-200 text-xs"
                >
                  Español
                </button>
              </div>
            )}
          </div>
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserDropdown(!showUserDropdown);
                  setShowLangDropdown(false);
                }}
                className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={user.profileImage || ""}
                    alt={user.full_name}
                  />
                  <AvatarFallback className="bg-[#FF6B35] text-white text-[10px]">
                    {getUserInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <div className="text-white text-xs font-medium">
                    {user.full_name}
                  </div>
                  <div className="text-white/60 text-[10px]">
                    {getRoleDisplay(user.role)}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-white" />
              </button>
              {showUserDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-black/95 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-white/10 min-w-[140px]">
                  <Link
                    href="/dashboard"
                    className="w-full px-2 py-2 text-left text-white hover:bg-[#FF6B35] transition-colors duration-200 text-xs flex items-center gap-1"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    {t("dashboard")}
                  </Link>
                  <Link
                    href={`/dashboard/${user.role}/profile`}
                    className="w-full px-2 py-2 text-left text-white hover:bg-[#FF6B35] transition-colors duration-200 text-xs flex items-center gap-1"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    {t("profile")}
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full px-2 py-2 text-left text-white hover:bg-red-600 transition-colors duration-200 text-xs flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

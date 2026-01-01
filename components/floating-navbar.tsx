"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function FloatingNavbar() {
  // Check for existing session on mount

  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const langContainerRef = useRef<HTMLDivElement>(null);
  const userContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isHome) {
        setIsScrolled(window.scrollY > 600);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const handleDashboardNavigation = () => {
    const sessionString = localStorage.getItem("auth_session");

    if (
      !sessionString ||
      sessionString === "undefined" ||
      sessionString === "null"
    ) {
      alert("Please login first or create an account");
      window.location.href = "/login";
      return;
    }

    let authsession;
    try {
      authsession = JSON.parse(sessionString);
    } catch (err) {
      console.error("Invalid session format:", err);
      alert("Session expired, please login again");
      localStorage.removeItem("auth_session");
      window.location.href = "/login";
      return;
    }

    const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || "";

    if (authsession.user.role === "user") {
      window.location.href = `${DASHBOARD_URL}/user`;
    } else if (authsession.user.role === "provider") {
      window.location.href = `${DASHBOARD_URL}/provider`;
    } else if (authsession.user.role === "admin") {
      window.location.href = `${DASHBOARD_URL}/admin`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        langContainerRef.current &&
        !langContainerRef.current.contains(e.target as Node)
      ) {
        setShowLangDropdown(false);
      }
      if (
        userContainerRef.current &&
        !userContainerRef.current.contains(e.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Fixed: Safe initials generator
  const getUserInitials = (name?: string) => {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return "U"; // fallback initial (U = User)
    }

    return name
      .trim()
      .split(" ")
      .map((n) => n[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  };

  const getRoleDisplay = (role: string) => {
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : "";
  };

  const navbarPosition =
    isHome && !isScrolled
      ? "fixed bottom-8 left-1/2 -translate-x-1/2"
      : "fixed top-4 left-1/2 -translate-x-1/2";

  return (
    <nav
      className={`${navbarPosition} z-50 bg-black/90 backdrop-blur-md rounded-full px-3 py-2 transition-all duration-300 shadow-2xl border border-white/10 md:px-4`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-end gap-2 max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-1 flex-shrink-0">
          <Image
            src="/images/logo/D_white.png"
            alt="DOLT Logo"
            width={24}
            height={24}
            className="rounded-full"
            priority
          />
        </Link>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Link
            href="/"
            className="text-white hover:text-[#FF6B35] transition-colors duration-300 text-xs font-medium truncate hidden sm:block"
          >
            {t("home")}
          </Link>
          <Link
            href="/services"
            className="text-white hover:text-[#FF6B35] transition-colors duration-300 text-xs font-medium truncate hidden sm:block"
          >
            {t("services")}
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-[#FF6B35] transition-colors duration-300 text-xs font-medium truncate hidden sm:block"
          >
            {t("about")}
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-[#FF6B35] transition-colors duration-300 text-xs font-medium truncate hidden sm:block"
          >
            {t("contact")}
          </Link>
          <div className="relative" ref={langContainerRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLangDropdown(!showLangDropdown);
                setShowUserDropdown(false);
              }}
              className="flex items-center gap-0.5 px-2 py-1 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded-full text-xs font-medium transition-colors duration-300"
              aria-expanded={showLangDropdown}
              aria-label={`Select language, current: ${language.toUpperCase()}`}
            >
              {language.toUpperCase()}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  showLangDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showLangDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-black/95 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-white/10 min-w-[100px] z-[60]">
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
            <div className="relative" ref={userContainerRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserDropdown(!showUserDropdown);
                  setShowLangDropdown(false);
                }}
                className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300"
                aria-expanded={showUserDropdown}
                aria-label={`User menu for ${user.full_name}`}
              >
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage
                    src={user.profileImage || ""}
                    alt={user.full_name || "User"}
                  />
                  <AvatarFallback className="bg-[#FF6B35] text-white text-[10px]">
                    {getUserInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block min-w-0">
                  <div
                    className="text-white text-xs font-medium truncate"
                    title={user.full_name}
                  >
                    {user.full_name}
                  </div>
                  <div className="text-white/60 text-[10px] truncate">
                    {getRoleDisplay(user.role)}
                  </div>
                </div>
                <ChevronDown
                  className={`w-3 h-3 text-white transition-transform ${
                    showUserDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showUserDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-black/95 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-white/10 min-w-[140px] z-[60]">
                  <Link
                    href="/dashboard"
                    className="w-full px-2 py-2 text-left text-white hover:bg-[#FF6B35] transition-colors duration-200 text-xs flex items-center gap-1"
                    onClick={() => {
                      setShowUserDropdown(false);
                      handleDashboardNavigation();
                    }}
                  >
                    {t("dashboard")}
                  </Link>
                  {/* <Link
                    href={`/dashboard/${user.role}/profile`}
                    className="w-full px-2 py-2 text-left text-white hover:bg-[#FF6B35] transition-colors duration-200 text-xs flex items-center gap-1"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    {t("profile")}
                  </Link> */}
                  {/* <Link
                    href={`/dashboard/${user.role}/settings`}
                    className="w-full px-2 py-2 text-left text-white hover:bg-[#FF6B35] transition-colors duration-200 text-xs flex items-center gap-1"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <Settings className="w-3 h-3" />
                    {t("settings")}
                  </Link> */}
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

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "es"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navbar
    services: "Services",
    about: "About",
    contact: "Contact",
    dashboard: "Dashboard",
    home: "Home",

    // Hero
    heroTitle1: "Your",
    heroTitle2: "ONE STOP",
    heroTitle3: "Complete Maintenance",
    heroTitle4: "SOLUTIONS",
    heroDescription:
      "Professional maintenance services for homes and businesses in Latin America. Predictive technology, IoT monitoring and 24/7 support by expert technicians.",
    bookService: "Book a Service",
    requestDemo: "Request Demo",
    learnMore: "Learn More",
    login: "Login",
    signup: "Sign Up",

    // Features
    smartMaintenance: "Smart Maintenance",
    solutions: "Solutions",
    featuresDescription:
      "Revolutionary maintenance services powered by IoT technology, predictive analytics, and expert technicians across Latin America.",
    iotMonitoring: "IoT Monitoring",
    iotDescription: "Real-time monitoring of your systems with smart sensors that predict issues before they occur.",
    predictiveTech: "Predictive Technology",
    predictiveDescription:
      "Advanced algorithms analyze data patterns to prevent costly breakdowns and extend equipment life.",
    expertTechnicians: "Expert Technicians",
    expertsDescription:
      "Certified professionals with years of experience in HVAC, plumbing, electrical, and IoT systems.",
    support247: "24/7 Support",
    supportDescription: "Round-the-clock monitoring and emergency response for critical maintenance issues.",
    uptimeGuarantee: "Uptime Guarantee",
    learnMoreServices: "Learn More About Our Services",

    // Highlights
    whyChoose: "Why Choose",
    dolt: "DOLT",
    highlightsDescription:
      "We combine cutting-edge technology with human expertise to deliver unmatched maintenance solutions.",
    yearsExperience: "Years of Experience",
    yearsDesc: "Serving Latin America with excellence",
    satisfiedClients: "Satisfied Clients",
    clientsDesc: "Across 15 countries",
    servicesCompleted: "Services Completed",
    servicesDesc: "With 99.9% success rate",
    technicianNetwork: "Technician Network",
    networkDesc: "Certified professionals ready to help",

    // Footer
    footerTagline: "Smart Maintenance Solutions",
    footerCopyright: "©2025 DOLT. All rights reserved.",

    // Auth
    logout: "Logout",
    cart: "Cart",

    // Dashboard
    myDashboard: "My Dashboard",
    adminDashboard: "Admin Dashboard",
    providerDashboard: "Provider Dashboard",
    managerDashboard: "Manager Dashboard",
    overview: "Overview",
    bookings: "Bookings",
    profile: "Profile",
    settings: "Settings",

    // Common
    viewDetails: "View Details",
    cancel: "Cancel",
    save: "Save",
    download: "Download",
    export: "Export",
    weekly: "Weekly",
    daily: "Daily",
    monthly: "Monthly",
    yearly: "Yearly",
  },
  es: {
    // Navbar
    services: "Servicios",
    about: "Acerca de",
    contact: "Contacto",
    dashboard: "Panel",
    home: "Inicio",

    // Hero
    heroTitle1: "Tu",
    heroTitle2: "ÚNICA PARADA",
    heroTitle3: "Soluciones Completas de Mantenimiento",
    heroTitle4: "SOLUCIONES",
    heroDescription:
      "Servicios profesionales de mantenimiento para hogares y empresas en América Latina. Tecnología predictiva, monitoreo IoT y soporte 24/7 por técnicos expertos.",
    bookService: "Reservar Servicio",
    requestDemo: "Solicitar Demo",
    learnMore: "Saber Más",
    login: "Iniciar Sesión",
    signup: "Registrarse",

    // Features
    smartMaintenance: "Mantenimiento Inteligente",
    solutions: "Soluciones",
    featuresDescription:
      "Servicios revolucionarios de mantenimiento impulsados por tecnología IoT, análisis predictivo y técnicos expertos en toda América Latina.",
    iotMonitoring: "Monitoreo IoT",
    iotDescription:
      "Monitoreo en tiempo real de sus sistemas con sensores inteligentes que predicen problemas antes de que ocurran.",
    predictiveTech: "Tecnología Predictiva",
    predictiveDescription:
      "Algoritmos avanzados analizan patrones de datos para prevenir averías costosas y extender la vida útil del equipo.",
    expertTechnicians: "Técnicos Expertos",
    expertsDescription:
      "Profesionales certificados con años de experiencia en HVAC, plomería, electricidad y sistemas IoT.",
    support247: "Soporte 24/7",
    supportDescription: "Monitoreo las 24 horas y respuesta de emergencia para problemas críticos de mantenimiento.",
    uptimeGuarantee: "Garantía de Tiempo de Actividad",
    learnMoreServices: "Más Información Sobre Nuestros Servicios",

    // Highlights
    whyChoose: "Por Qué Elegir",
    dolt: "DOLT",
    highlightsDescription:
      "Combinamos tecnología de vanguardia con experiencia humana para ofrecer soluciones de mantenimiento inigualables.",
    yearsExperience: "Años de Experiencia",
    yearsDesc: "Sirviendo a América Latina con excelencia",
    satisfiedClients: "Clientes Satisfechos",
    clientsDesc: "En 15 países",
    servicesCompleted: "Servicios Completados",
    servicesDesc: "Con 99.9% de tasa de éxito",
    technicianNetwork: "Red de Técnicos",
    networkDesc: "Profesionales certificados listos para ayudar",

    // Footer
    footerTagline: "Soluciones Inteligentes de Mantenimiento",
    footerCopyright: "©2025 DOLT. Todos los derechos reservados.",

    // Auth
    logout: "Cerrar Sesión",
    cart: "Carrito",

    // Dashboard
    myDashboard: "Mi Panel",
    adminDashboard: "Panel de Administrador",
    providerDashboard: "Panel de Proveedor",
    managerDashboard: "Panel de Gerente",
    overview: "Resumen",
    bookings: "Reservas",
    profile: "Perfil",
    settings: "Configuración",

    // Common
    viewDetails: "Ver Detalles",
    cancel: "Cancelar",
    save: "Guardar",
    download: "Descargar",
    export: "Exportar",
    weekly: "Semanal",
    daily: "Diario",
    monthly: "Mensual",
    yearly: "Anual",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "es")) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (isClient) {
      localStorage.setItem("language", lang)
    }
    window.dispatchEvent(new Event("languagechange"))
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

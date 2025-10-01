"use client"

import { useEffect } from "react"
import Lenis from "@studio-freight/lenis"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Highlights from "@/components/highlights"
import Footer from "@/components/footer"
import FloatingNavbar from "@/components/floating-navbar"

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <main>
      <FloatingNavbar />
      <Hero />
      <Features />
      <Highlights />
      <Footer />
    </main>
  )
}

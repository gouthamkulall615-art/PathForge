import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/gsapSetup'
import LandingNav from '../components/landing/LandingNav'
import Hero from '../components/landing/Hero'
import StatsStrip from '../components/landing/StatsStrip'
import TracksGrid from '../components/landing/TracksGrid'
import HowItWorksPinned from '../components/landing/HowItWorksPinned'
import HeatScrub from '../components/landing/HeatScrub'
import Calibrator from '../components/landing/Calibrator'
import FeatureGrid from '../components/landing/FeatureGrid'
import OpenSourceBand from '../components/landing/OpenSourceBand'
import FAQ from '../components/landing/FAQ'
import FinalCTA from '../components/landing/FinalCTA'
import Footer from '../components/landing/Footer'

export default function Landing() {
  // Pinned sections in a lazy route: refresh ScrollTrigger after mount and fonts ready
  useEffect(() => {
    ScrollTrigger.refresh()
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 250)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--forge-canvas)] text-[var(--forge-ink)]">
      <LandingNav />
      <main id="main-content">
        {/* 1. Hero with ForgeHeroMap */}
        <Hero />

        {/* 2. Stats Strip */}
        <StatsStrip />

        {/* 3. Tracks Grid */}
        <TracksGrid />

        {/* 4. How It Works (Pinned 3-step scrub) */}
        <HowItWorksPinned />

        {/* 5. Heat Metaphor (Pinned single-node scrub) */}
        <HeatScrub />

        {/* 6. Interactive Calibrator */}
        <Calibrator />

        {/* 7. Bento Feature Grid */}
        <FeatureGrid />

        {/* 8. Open Source & Developer Band */}
        <OpenSourceBand />

        {/* 9. FAQ Accordion */}
        <FAQ />

        {/* 10. Final Call To Action */}
        <FinalCTA />
      </main>
      {/* 11. Minimal Footer */}
      <Footer />
    </div>
  )
}

import { Suspense } from 'react'
import LandingNav from '../components/landing/LandingNav'
import Hero from '../components/landing/Hero'
import StatsStrip from '../components/landing/StatsStrip'
import TracksGrid from '../components/landing/TracksGrid'
import HowItWorks from '../components/landing/HowItWorks'
import HeatMetaphor from '../components/landing/HeatMetaphor'
import Features from '../components/landing/Features'
import PersonalizedPathPreview from '../components/landing/PersonalizedPathPreview'
import OpenSourceBand from '../components/landing/OpenSourceBand'
import FAQ from '../components/landing/FAQ'
import FinalCTA from '../components/landing/FinalCTA'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-[#0b0d14] text-[#111827] dark:text-[#eef0f5]">
      <LandingNav />
      <main id="main-content">
        <Hero />
        <StatsStrip />
        <TracksGrid />
        <HowItWorks />
        <HeatMetaphor />
        <Features />
        <PersonalizedPathPreview />
        <OpenSourceBand />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}


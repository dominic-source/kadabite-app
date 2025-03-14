'use client'
import { useState, useEffect } from 'react'
import Hero from '~/components/homepage/Hero'
import HowItWorks from '~/components/homepage/HowItWorks'
import PerfectFit from '~/components/homepage/PerfectFit'
import Testimonials from '~/components/homepage/Testimonials'
import UserSection from '~/components/homepage/UserSection'
import Video from '~/components/homepage/Video'
import DashboardNavbar from '~/components/dashboard/navbar'
import FlashScreen from '~/components/dashboard/flash_screen'
import RedirectPage from '~/components/dashboard/redirect_page'

// interface HomePageProps {}

const Home: React.FC = () => {
  const [showContent, setShowContent] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true)

  useEffect(() => {
    // After the FlashScreen duration, set showContent to true
    const timer = setTimeout(() => {
      setShowContent(true)
      setIsLoggedIn(false)
    }, 5000) // Adjust the duration to match your FlashScreen's total duration

    return () => clearTimeout(timer) // Clear timeout on unmount
  }, [])

  interface FlashScreenProps {
    duration: number
    image1Src: string
    image2Src: string
    image3Src: string
    image4Src: string
  }

  const flashScreenProps: FlashScreenProps = {
    duration: 1000,
    image1Src: '/images/welcome-page/kadabite.png',
    image2Src: '/images/welcome-page/kadabiteText.png',
    image3Src: '/images/welcome-page/bikeKadabite.png',
    image4Src: '/images/welcome-page/bikeKadabiteNext.png',
  }

  return (
    <>
      <FlashScreen {...flashScreenProps} />

      {showContent &&
        (isLoggedIn ? (
          <>
            <Hero />
            <DashboardNavbar />
            <UserSection />
            <Video />
            <HowItWorks />
            <Testimonials />
            <PerfectFit />
          </>
        ) : (
          <RedirectPage />
        ))}
    </>
  )
}

export default Home

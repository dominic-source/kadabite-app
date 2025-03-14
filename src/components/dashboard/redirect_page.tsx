'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { cn } from '~/utils'

const RedirectPage: React.FC = () => {
  const [state, setState] = useState<'initial' | 'next' | 'final'>('initial')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const totalTimeLimit = 120

  const backgroundColor =
    state === 'initial'
      ? 'bg-primary'
      : state === 'next'
        ? 'bg-secondary'
        : 'bg-primary'

  const textColor =
    state === 'initial'
      ? 'text-[hsla(226,15%,17%,1)]'
      : state === 'next'
        ? 'text-white'
        : 'text-[hsla(226,15%,17%,1)]'

  const buttonVariantLeft =
    state === 'initial' ? 'primary' : state === 'next' ? 'secondary' : 'primary'
  const buttonVariantRight =
    state === 'initial'
      ? 'secondary'
      : state === 'next'
        ? 'primary'
        : 'secondary'

  const imageUrl =
    state === 'initial'
      ? '/images/welcome-page/bike_black.png'
      : state === 'next'
        ? '/images/welcome-page/bike_yellow.png'
        : '/images/welcome-page/darkBikeKa.png'

  const imageUrlDesktop =
    state === 'initial'
      ? '/images/welcome-page/darkBike.png'
      : state === 'next'
        ? '/images/welcome-page/yellowBikeFull.png'
        : '/images/welcome-page/darkBike.png'

  const content =
    state === 'initial'
      ? "I don't feel like cooking. Let's order food delivery."
      : state === 'next'
        ? 'Donut worry, be happy and eat more donuts!'
        : 'Good music and good food makes me happy.'

  useEffect(() => {
    if (timeElapsed < totalTimeLimit) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 3)
        setState((prevState) => {
          if (prevState === 'initial') return 'next'
          if (prevState === 'next') return 'final'
          return 'initial'
        })
      }, 3000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timeElapsed, totalTimeLimit])

  return (
    <>
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-screen overflow-hidden text-center text-2xl font-bold text-white',
          backgroundColor
        )}
      >
        {/* Image for larger screens (laptops) */}
        <div
          className={cn(
            'mb-8 h-[80vh] md:mb-20 md:mt-4 md:flex md:h-[66.60vh] md:items-center md:justify-center md:text-left',
            state === 'next'
              ? 'flex-col-reverse md:flex-row'
              : 'md:flex-row-reverse'
          )}
        >
          <Image
            className="ml-4 hidden md:block" // Hidden by default, shown on medium screens and up, moved to the right
            src={imageUrlDesktop}
            alt="Bike part (laptop)"
            width={500}
            height={200}
          />

          {/* Image for smaller screens (phones) */}
          <Image
            className={cn('block md:hidden', state === 'final' ? '' : 'ml-20')} // Shown by default, hidden on medium screens and up, moved to the right
            src={imageUrl}
            alt="Bike part (phone)"
            width={280}
            height={100}
          />

          <div
            className={cn(
              'ml-4 w-72 text-left font-poppins text-3xl font-bold leading-[44px] md:text-4xl',
              textColor
            )}
          >
            {content}
          </div>
        </div>
        <div className="mb-0 flex items-center justify-center space-x-2 md:flex-row md:justify-around md:space-x-4">
          <Button
            variant={buttonVariantLeft}
            size="md"
            className={cn(
              'border border-solid text-white',
              buttonVariantLeft === 'primary'
                ? 'bg-[hsla(0, 0%, 100%, 0.21)]'
                : 'bg-[hsla(0, 0%, 100%, 1)]'
            )}
            onClick={() => (window.location.href = '/dashboard')}
          >
            Sign Up
          </Button>

          <Button
            variant={buttonVariantRight}
            size="md"
            className={cn(
              backgroundColor === 'bg-secondary'
                ? 'hover:bg-white hover:text-black'
                : ''
            )}
            onClick={() => (window.location.href = '/dashboard')}
          >
            Log In
          </Button>
        </div>
      </div>
    </>
  )
}

export default RedirectPage

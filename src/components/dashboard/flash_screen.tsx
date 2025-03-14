'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface FlashScreenProps {
  image1Src: string
  image2Src: string
  image3Src: string
  image4Src: string
  duration: number // Duration in milliseconds
}

const FlashScreen: React.FC<FlashScreenProps> = ({
  image1Src,
  image2Src,
  image3Src,
  image4Src,
  duration,
}) => {
  const [stage, setStage] = useState(0) // 0: white, 1: image1, 2: image2, 3: image3, 4: image4, 5: done
  const [isVisible, setIsVisible] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null) // useRef to hold the timer

  useEffect(() => {
    if (!isVisible) return

    const setTimer = (callback: () => void, delay: number) => {
      timerRef.current = setTimeout(callback, delay)
    }

    switch (stage) {
      case 0:
        setTimer(() => setStage(1), duration)
        break
      case 1:
        setTimer(() => setStage(2), duration)
        break
      case 2:
        setTimer(() => setStage(3), duration)
        break
      case 3:
        setTimer(() => setStage(4), duration)
        break
      case 4:
        setTimer(() => setStage(5), duration)
        break
      case 5:
        setTimer(() => {
          setIsVisible(false)
        }, duration)
        break
      default:
        setIsVisible(false)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current) // Clear timeout using ref
      }
    }
  }, [stage, duration, isVisible])

  if (!isVisible) {
    return null // Or return the actual app content here
  }

  let content

  switch (stage) {
    case 0:
      content = (
        <div className="fixed left-0 top-0 z-50 h-full w-full bg-white"></div>
      )
      break
    case 1:
      content = (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white">
          <Image src={image1Src} alt="Logo 1" width={200} height={200} />
        </div>
      )
      break
    case 2:
      content = (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white">
          <Image src={image2Src} alt="Logo 2" width={200} height={200} />
        </div>
      )
      break
    case 3:
      content = (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center space-y-4 bg-white">
          <Image src={image3Src} alt="Logo 2" width={200} height={200} />
          <Image src={image2Src} alt="Logo 2" width={200} height={200} />
        </div>
      )
      break
    case 4:
      content = (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center space-y-4 bg-white">
          <Image src={image4Src} alt="Logo 2" width={200} height={200} />
          <Image src={image2Src} alt="Logo 2" width={200} height={200} />
        </div>
      )
      break
    default:
      content = null
  }

  return content
}

export default FlashScreen

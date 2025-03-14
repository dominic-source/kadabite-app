'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import useEnvironmentStore from '~/hooks/global/use-enviroment'
import { signOut } from 'next-auth/react'
import { cn } from '~/utils'
import { FaNodeJs, FaPython } from 'react-icons/fa' // Import icons

export default function EnvironmentSwitcher() {
  const { backend, setBackend } = useEnvironmentStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentBackend = backend || 'default'

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="mb-2 text-lg font-bold text-white">Backend Environment</h3>
      <div className="flex items-center space-x-4">
        <motion.div
          className="relative flex h-12 w-24 cursor-pointer items-center justify-center rounded-full bg-white"
          onClick={async () => {
            const newBackend = currentBackend === 'python' ? 'node' : 'python'
            setBackend(newBackend)
            await signOut({
              callbackUrl: '/',
            })
          }}
          aria-label={`Switch to ${currentBackend === 'python' ? 'NODE' : 'Python'}`}
        >
          <motion.div
            className="absolute h-11 w-11 rounded-full"
            layout
            transition={{
              type: 'spring',
              stiffness: 600,
              damping: 30,
            }}
            style={{
              backgroundColor:
                currentBackend === 'python' ? '#306998' : '#8892BF',
              left: currentBackend === 'python' ? '2px' : 'calc(100% - 46px)',
            }}
          />
          {currentBackend === 'python' ? (
            <FaPython className={cn('absolute left-0.5 h-9 w-9')} />
          ) : (
            <FaNodeJs className={cn('absolute left-0.5 h-9 w-9')} />
          )}
        </motion.div>
        <span className="text-lg font-semibold text-white">
          {currentBackend === 'python'
            ? 'Python'
            : currentBackend === 'node'
              ? 'NODE'
              : 'Default'}
        </span>
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
          onClick={async () => {
            setBackend('')
            await signOut({
              callbackUrl: '/',
            })
          }}
        >
          Default
        </button>
      </div>
    </motion.div>
  )
}

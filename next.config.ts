/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Other configurations...
}

const withPWA = require('next-pwa')({
  dest: 'public', // Destination directory for the PWA files
  disable: false,
  // disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker to activate
})

module.exports = withPWA(nextConfig)

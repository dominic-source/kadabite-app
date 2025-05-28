import React from 'react'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to Kadabite Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Order food from your favorite restaurants and track your deliveries.
        </p>
      </header>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-2 text-xl font-semibold">Your Orders</h2>
          <p className="text-gray-500">View and manage your recent orders.</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-2 text-xl font-semibold">Browse Restaurants</h2>
          <p className="text-gray-500">
            Find new places to eat and explore menus.
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-2 text-xl font-semibold">Account Settings</h2>
          <p className="text-gray-500">Update your profile and preferences.</p>
        </div>
      </section>
    </main>
  )
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type EnvironmentStore = {
  backend: '' | 'python' | 'node'
  setBackend: (backend: 'python' | 'node' | '') => void
}

const useEnvironmentStore = create<EnvironmentStore>()(
  persist(
    (set) => ({
      backend: '', // Default backend is an empty string
      setBackend: (backend) => set({ backend }),
    }),
    {
      name: 'environment-storage',
    }
  )
)

export default useEnvironmentStore

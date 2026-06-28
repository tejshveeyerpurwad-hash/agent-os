import { create } from 'zustand'

interface AppStore {
  sidebarOpen: boolean
  isMobile: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setIsMobile: (isMobile: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: true,
  isMobile: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
}))

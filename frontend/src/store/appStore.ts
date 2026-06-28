import { create } from 'zustand'

interface AppStore {
  sidebarOpen: boolean
  rightPanelOpen: boolean
  isMobile: boolean
  commandOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleRightPanel: () => void
  setRightPanelOpen: (open: boolean) => void
  setIsMobile: (isMobile: boolean) => void
  setCommandOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: true,
  rightPanelOpen: true,
  isMobile: false,
  commandOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setRightPanelOpen: (open: boolean) => set({ rightPanelOpen: open }),
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
  setCommandOpen: (open: boolean) => set({ commandOpen: open }),
}))

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  boardView: 'board' | 'list';
  setBoardView: (view: 'board' | 'list') => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      boardView: 'board',
      setBoardView: (view) => set({ boardView: view }),
    }),
    { name: 'taskflow-ui' },
  ),
);

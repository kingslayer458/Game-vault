import { create } from 'zustand';

interface MenuStore {
  isOpen: boolean;
  toggle: () => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
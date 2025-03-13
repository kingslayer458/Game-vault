import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Game } from '../lib/api';

interface WishlistStore {
  items: Game[];
  addItem: (game: Game) => void;
  removeItem: (gameId: number) => void;
  isInWishlist: (gameId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (game) => set((state) => ({
        items: [...state.items, game],
      })),
      removeItem: (gameId) => set((state) => ({
        items: state.items.filter((item) => item.id !== gameId),
      })),
      isInWishlist: (gameId) => get().items.some((item) => item.id === gameId),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
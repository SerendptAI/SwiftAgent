import { create } from "zustand";

export interface SavedCard {
  last4: string;
  nameOnCard: string;
}

interface CardState {
  savedCards: SavedCard[];
  addCard: (card: SavedCard) => void;
  removeCard: (last4: string) => void;
}

export const useCardStore = create<CardState>((set) => ({
  savedCards: [],
  addCard: (card) =>
    set((state) => ({ savedCards: [...state.savedCards, card] })),
  removeCard: (last4) =>
    set((state) => ({
      savedCards: state.savedCards.filter((c) => c.last4 !== last4),
    })),
}));

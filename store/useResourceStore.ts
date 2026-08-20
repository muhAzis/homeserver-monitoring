import { T_ResourceLive } from '@/app/api/resources/live/route';
import { create } from 'zustand';

type T_ResourceStore = {
  liveData: T_ResourceLive | null;
  history: T_ResourceLive[];
  
  updateData: (newData: T_ResourceLive) => void;
}

export const useResourceStore = create<T_ResourceStore>((set, get) => ({
  liveData: null,
  history: [],

  updateData: (newData) => set((state) => ({
    liveData: newData,
    history: [...state.history, newData].slice(-60)
  })),
}));
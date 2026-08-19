import { T_DashLive } from '@/app/api/dashboard/live/route';
import { create } from 'zustand';

type T_SystemStore = {
  liveData: T_DashLive | null;
  history: T_DashLive[];
  
  updateData: (newData: T_DashLive) => void;
}

export const useSystemStore = create<T_SystemStore>((set, get) => ({
  liveData: null,
  history: [],

  updateData: (newData) => set((state) => ({
    liveData: newData,
    history: [...state.history, newData].slice(-60)
  })),
}));
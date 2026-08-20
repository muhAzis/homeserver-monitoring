import { T_DashLive } from '@/app/api/dashboard/live/route';
import { T_ServicesLive } from '@/app/api/dashboard/live/services/route';
import { create } from 'zustand';

type T_SystemStore = {
  liveData: T_DashLive | null;
  liveDataServices: T_ServicesLive | null;
  history: T_DashLive[];
  historyServices: T_ServicesLive[];
  
  updateData: (newData: T_DashLive) => void;
  updateDataServices: (newData: T_ServicesLive) => void;
}

export const useSystemStore = create<T_SystemStore>((set, get) => ({
  liveData: null,
  liveDataServices: null,
  history: [],
  historyServices: [],

  updateData: (newData) => set((state) => ({
    liveData: newData,
    history: [...state.history, newData].slice(-60)
  })),
  updateDataServices: (newData) => set((state) => ({
    liveDataServices: newData,
    historyServices: [...state.historyServices, newData].slice(-60)
  })),
}));
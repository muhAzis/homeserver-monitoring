import { T_ProcessesLive } from '@/app/api/processes/live/route';
import { create } from 'zustand';

type T_ProcessesStore = {
  liveData: T_ProcessesLive | null;
  history: T_ProcessesLive[];
  
  updateData: (newData: T_ProcessesLive) => void;
}

export const useProcessesStore = create<T_ProcessesStore>((set, get) => ({
  liveData: null,
  history: [],

  updateData: (newData) => set((state) => ({
    liveData: newData,
    history: [...state.history, newData].slice(-60)
  })),
}));
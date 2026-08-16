import { create } from "zustand";
import React from "react";

// Tipe data untuk konfigurasi form
interface T_ConfirmConfig {
  title: string;
  description: string;
  content?: React.ReactNode;
  cancelButtonText?: string;
  submitButtonText?: string;
  onCancel?: () => void;
  onSubmit: () => void | Promise<void>;
}

// Tipe data untuk Store Zustand
interface T_ConfirmState {
  open: boolean;
  isLoading: boolean;
  config: T_ConfirmConfig | null;
  
  // Actions
  confirm: (config: T_ConfirmConfig) => void;
  close: () => void;
  setLoading: (loading: boolean) => void;
}

export const useConfirmStore = create<T_ConfirmState>((set) => ({
  open: false,
  isLoading: false,
  config: null,
  
  // Saat dipanggil, otomatis buka popup dan set config
  confirm: (config) => set({
    config,
    open: true,
    isLoading: false
  }),
  
  // Tutup popup
  close: () => set({ open: false }),
  
  // Update status loading saat proses onSubmit berjalan
  setLoading: (loading) => set({ isLoading: loading }),
}));
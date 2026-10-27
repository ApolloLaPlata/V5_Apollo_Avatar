/**
 * V5 Apollo Avatar - Native Toast Notification Store
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Zero external dependencies, 100% sovereign Dark Luxury notifications
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 3500
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  showToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newItem: ToastItem = {
      id,
      duration: 3500,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newItem],
    }));

    if (newItem.duration && newItem.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newItem.duration);
    }

    return id;
  },

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearAll: () => set({ toasts: [] }),
}));

/**
 * Convenient toast helper for fast invocation anywhere
 */
export const toast = {
  success: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().showToast({ type: 'success', title, message, duration }),
  info: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().showToast({ type: 'info', title, message, duration }),
  warning: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().showToast({ type: 'warning', title, message, duration }),
  error: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().showToast({ type: 'error', title, message, duration }),
};

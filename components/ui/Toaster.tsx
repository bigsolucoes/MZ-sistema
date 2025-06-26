import React, { useEffect } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    // Auto-dismiss after 5 seconds, ensure this logic is robust if component unmounts
    const timerId = setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(toast => toast.id !== id) }));
    }, 5000);
    // It's good practice to clear timers if the store itself were to be destroyed,
    // but for a global store like this, it's usually fine.
    // For individual toast components, useEffect cleanup is better.
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(toast => toast.id !== id) })),
}));

export const toast = (message: string, type: ToastType = 'info') => {
  useToastStore.getState().addToast(message, type);
};

const ToastIcons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const ToastColors: Record<ToastType, { bg: string; text: string; icon: string; ring: string }> = {
  success: { bg: 'bg-green-500 dark:bg-green-600', text: 'text-white', icon: 'text-white', ring: 'ring-green-500' },
  error: { bg: 'bg-red-500 dark:bg-red-600', text: 'text-white', icon: 'text-white', ring: 'ring-red-500' },
  info: { bg: 'bg-blue-500 dark:bg-blue-600', text: 'text-white', icon: 'text-white', ring: 'ring-blue-500' },
  warning: { bg: 'bg-yellow-400 dark:bg-yellow-500', text: 'text-black dark:text-gray-900', icon: 'text-black dark:text-gray-900', ring: 'ring-yellow-500' },
};

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-[200] w-full max-w-sm space-y-3 sm:max-w-md">
      <AnimatePresence initial={false}>
        {toasts.map((toastItem) => {
          const IconComponent = ToastIcons[toastItem.type];
          const colors = ToastColors[toastItem.type];
          return (
            <motion.div
              key={toastItem.id}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              layout // Handles smooth reordering
              className={`flex items-start p-4 rounded-xl shadow-2xl ${colors.bg} ${colors.text} ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10`}
            >
              <div className="flex-shrink-0 pt-0.5">
                <IconComponent className={`h-6 w-6 ${colors.icon}`} aria-hidden="true" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{toastItem.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => removeToast(toastItem.id)}
                  className={`inline-flex rounded-md p-1 ${colors.text} opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 ${colors.ring}`}
                  aria-label="Close toast"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

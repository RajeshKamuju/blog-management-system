import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export default function Toast({ toasts, onClose }: ToastProps) {
  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            id={`toast-${toast.id}`}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 ${
              toast.type === "success"
                ? "bg-emerald-50/90 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200"
                : toast.type === "error"
                ? "bg-rose-50/90 dark:bg-rose-950/90 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200"
                : toast.type === "warning"
                ? "bg-amber-50/90 dark:bg-amber-950/90 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200"
                : "bg-blue-50/90 dark:bg-blue-950/90 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-200"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle2 id="icon-success" className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />}
              {toast.type === "error" && <AlertCircle id="icon-error" className="w-5 h-5 text-rose-500 dark:text-rose-400" />}
              {toast.type === "warning" && <ShieldAlert id="icon-warning" className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
              {toast.type === "info" && <Info id="icon-info" className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
            </div>
            
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.text}
            </div>

            <button
              id={`close-toast-${toast.id}`}
              onClick={() => onClose(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  isLoading = false,
  loadingLabel = "Processing...",
}) => {
  const [internalLoading, setInternalLoading] = React.useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={isLoading ? undefined : onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md p-6 overflow-hidden z-[10000] flex flex-col gap-4"
          >
            <div className="flex items-start gap-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isDestructive 
                  ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400" 
                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
              }`}>
                {isDestructive ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </span>
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading || internalLoading}
                className="rounded-xl border border-border bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={async () => {
                  setInternalLoading(true);
                  try {
                    await onConfirm();
                    onClose();
                  } catch (err) {
                    console.error("Confirmation error:", err);
                  } finally {
                    setInternalLoading(false);
                  }
                }}
                disabled={isLoading || internalLoading}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDestructive 
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" 
                    : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {(isLoading || internalLoading) ? loadingLabel : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

type ToastKind = "success" | "error";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, kind, message }]);
      window.setTimeout(() => dismiss(id), TOAST_DURATION);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message: string) => push("success", message),
      error: (message: string) => push("error", message),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed top-4 right-4 left-4 z-[9999] flex flex-col items-end gap-2 sm:top-6 sm:right-6 sm:left-auto">
            {toasts.map((t) => (
              <ToastCard
                key={t.id}
                kind={t.kind}
                message={t.message}
                onDismiss={() => dismiss(t.id)}
              />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

function ToastCard({
  kind,
  message,
  onDismiss,
}: {
  kind: ToastKind;
  message: string;
  onDismiss: () => void;
}) {
  const isSuccess = kind === "success";
  return (
    <div
      role="status"
      className={`animate-in fade-in slide-in-from-top-2 pointer-events-auto flex w-full items-start gap-3 rounded-lg border px-4 py-3 shadow-lg duration-200 sm:max-w-sm ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      )}
      <p className="flex-1 text-sm">{message}</p>
      <button
        aria-label="Dismiss"
        onClick={onDismiss}
        className={`shrink-0 rounded-md p-0.5 transition-colors ${
          isSuccess
            ? "text-green-500 hover:bg-green-100"
            : "text-red-500 hover:bg-red-100"
        }`}
      >
        <span aria-hidden className="text-lg leading-none">
          ×
        </span>
      </button>
    </div>
  );
}

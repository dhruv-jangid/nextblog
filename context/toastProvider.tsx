"use client";

import {
  Toaster,
  toast as hotToast,
  ToastOptions as HotToastOptions,
} from "react-hot-toast";
import { smartTruncate } from "@/lib/utils";
import { createContext, useContext } from "react";

type ToastPayload = {
  title: string;
  description?: string;
  icon?: string;
  duration?: number;
};

type ToastContextType = {
  toast: (payload: ToastPayload) => void;
  success: (payload: ToastPayload) => void;
  error: (payload: ToastPayload) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const showToast = (
    type: "normal" | "success" | "error",
    { title, description, icon, duration }: ToastPayload
  ) => {
    const content = description ? (
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{smartTruncate({ text: title })}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
    ) : (
      title
    );

    const options: HotToastOptions = {
      icon,
      duration,
    };

    switch (type) {
      case "success":
        hotToast.success(content, options);
        break;
      case "error":
        hotToast.error(content, options);
        break;
      default:
        hotToast(content, options);
    }
  };

  const toast: ToastContextType = {
    toast: (payload) => showToast("normal", payload),
    success: (payload) => showToast("success", payload),
    error: (payload) => showToast("error", payload),
  };

  return (
    <ToastContext.Provider value={toast}>
      <Toaster
        position="top-center"
        toastOptions={{ style: { borderRadius: "1rem" } }}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
};

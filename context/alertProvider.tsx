"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { createContext, useContext, useState } from "react";

type AlertDialogOptions = {
  title?: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
};

const AlertDialogContext = createContext<{
  show: (options: AlertDialogOptions) => void;
} | null>(null);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AlertDialogOptions>({});

  const show = (opts: AlertDialogOptions) => {
    setOptions(opts);
    setOpen(true);
  };

  const handleConfirm = () => {
    options.onConfirm?.();
    setOpen(false);
  };

  return (
    <AlertDialogContext.Provider value={{ show }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {options.title || "Are you sure?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {options.description || "This action cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {options.cancelLabel || "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                {options.actionLabel || "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};

export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error("useAlertDialog must be used within AlertDialogProvider");
  }
  return context;
};

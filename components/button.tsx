"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  roseVariant?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  roseVariant = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 ${
        roseVariant
          ? "bg-rose-300 text-neutral-950 hover:bg-neutral-800 hover:text-rose-300"
          : "bg-neutral-900 border border-neutral-800"
      } py-2 px-3.5 leading-tight tracking-tight rounded-4xl hover:-translate-y-1 hover:translate-x-1 ease-out duration-300 hover:shadow-[-4px_4px_0px_rgba(0,0,0,1)] shadow-rose-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};

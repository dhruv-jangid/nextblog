"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="bg-rose-300 text-neutral-950 tracking-tight cursor-pointer px-3.5 py-2 leading-tight rounded-2xl w-max hover:bg-neutral-800 hover:text-rose-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
      {...props}
    >
      {children}
    </button>
  );
};

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="bg-[#EEEEEE] text-[#0F0F0F] cursor-pointer px-3 py-1.5 rounded-xl w-max hover:bg-[#EEEEEE]/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
};

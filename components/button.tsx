import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="bg-white/10 text-[#EEEEEE] cursor-pointer px-3 py-1 rounded-xl w-max hover:hover:bg-white/5 transition-all duration-300"
      {...props}
    >
      {children}
    </button>
  );
};

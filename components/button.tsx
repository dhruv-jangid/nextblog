import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="bg-[#EEEEEE] cursor-pointer px-3 py-1 rounded-xl w-max text-black hover:bg-[#EEEEEE]/80 transition-all duration-300"
      {...props}
    >
      {children}
    </button>
  );
};

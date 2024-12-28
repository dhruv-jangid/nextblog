import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children }: ButtonProps) {
  return (
    <button className="bg-[#EEEEEE] px-3 py-1 rounded-lg w-max text-black">
      {children}
    </button>
  );
}

export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-[#EEEEEE] px-3 py-1 rounded-lg w-max text-black hover:bg-[#EEEEEE]/80 transition-all duration-300">
      {children}
    </button>
  );
}

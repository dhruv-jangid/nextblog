export default function Loading() {
  return (
    <div className="min-h-dvh flex flex-col items-center gap-20 p-2 overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-28 md:gap-y-56 text-muted-foreground/50 text-sm self-start w-full">
        <span className="tracking-tight">IDEAS THAT STICK</span>
        <span className="tracking-tight">WORDS WITH PURPOSE</span>
        <span className="tracking-tight">THOUGHTS IN DESIGN</span>
        <span className="tracking-tight">IDEAS THAT STICK</span>
        <span className="tracking-tight">WORDS WITH PURPOSE</span>
        <span className="tracking-tight">THOUGHTS IN DESIGN</span>
      </div>

      <div className="flex flex-col gap-1 xl:gap-2 items-center w-full">
        <div className="text-7xl xl:text-9xl tracking-tighter border-t border-b border-dashed">
          LOADING
        </div>
        <div className="text-2xl xl:text-4xl tracking-tighter">Innovation</div>
        <div className="text-2xl xl:text-4xl ml-28 tracking-tighter">
          design built-in
        </div>
      </div>
    </div>
  );
}

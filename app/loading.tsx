export default function Loading() {
  return (
    <div className="h-[80dvh] flex items-center justify-center gap-2">
      <div className="w-3 h-3 bg-rose-300 rounded-full animate-[bounce_1s_infinite_0ms]" />
      <div className="w-3 h-3 bg-rose-300 rounded-full animate-[bounce_1s_infinite_200ms]" />
      <div className="w-3 h-3 bg-rose-300 rounded-full animate-[bounce_1s_infinite_400ms]" />
    </div>
  );
}

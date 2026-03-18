export default function MetasLoading() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-56 bg-zinc-800 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="h-5 w-32 bg-zinc-800 rounded" />
          <div className="h-16 w-24 bg-zinc-800 rounded" />
          <div className="h-3 w-20 bg-zinc-800 rounded" />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="h-5 w-36 bg-zinc-800 rounded" />
          <div className="space-y-2">
            <div className="h-3 w-28 bg-zinc-800 rounded" />
            <div className="h-10 w-full bg-zinc-800 rounded-lg" />
          </div>
          <div className="h-10 w-full bg-zinc-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

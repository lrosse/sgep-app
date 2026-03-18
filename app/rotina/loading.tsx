export default function RotinaLoading() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-72 bg-zinc-800 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="h-5 w-40 bg-zinc-800 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-zinc-800 rounded" />
              <div className="h-10 w-full bg-zinc-800 rounded-lg" />
            </div>
          ))}
          <div className="h-10 w-full bg-zinc-800 rounded-lg" />
        </div>

        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="h-5 w-32 bg-zinc-800 rounded" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-full bg-zinc-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

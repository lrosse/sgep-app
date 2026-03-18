export default function DashboardLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-80 bg-zinc-800 rounded-lg" />
      </div>

      {/* Streak */}
      <div className="h-20 w-full bg-zinc-900 border border-zinc-800 rounded-xl" />

      {/* Cards de stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3"
          >
            <div className="h-4 w-32 bg-zinc-800 rounded" />
            <div className="h-8 w-16 bg-zinc-800 rounded" />
            <div className="h-3 w-40 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>

      {/* Cronograma */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="h-5 w-48 bg-zinc-800 rounded" />
        <div className="flex gap-4 border-b border-zinc-800 pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-20 bg-zinc-800 rounded" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full bg-zinc-800 rounded-lg" />
        ))}
      </div>

      {/* Histórico */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="h-5 w-40 bg-zinc-800 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full bg-zinc-800 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

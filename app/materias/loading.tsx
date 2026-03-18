export default function MateriasLoading() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-72 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-64 bg-zinc-800 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Formulário */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="h-5 w-32 bg-zinc-800 rounded" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-zinc-800 rounded" />
              <div className="h-10 w-full bg-zinc-800 rounded-lg" />
            </div>
          ))}
          <div className="h-10 w-full bg-zinc-800 rounded-lg" />
        </div>

        {/* Grid de matérias */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <div className="h-1.5 w-full bg-zinc-800" />
              <div className="p-5 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-zinc-800 rounded" />
                    <div className="h-3 w-24 bg-zinc-800 rounded" />
                  </div>
                  <div className="h-6 w-8 bg-zinc-800 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-zinc-800 rounded" />
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 flex-1 bg-zinc-800 rounded-lg" />
                  <div className="h-9 flex-1 bg-zinc-800 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

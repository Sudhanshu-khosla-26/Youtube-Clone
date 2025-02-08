

const LoadingGrid = () => {
    return (
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div className="flex flex-col gap-2" key={i}>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800 animate-pulse" />
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-800 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-zinc-800 rounded w-[80%] mb-2 animate-pulse" />
            <div className="h-3 bg-zinc-800 rounded w-[60%] mb-2 animate-pulse" />
            <div className="h-3 bg-zinc-800 rounded w-[40%] animate-pulse" />
          </div>
        </div>
      </div>
        ))}
      </div>
    )
  }

export default LoadingGrid;
  
  
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-2/5 max-w-md rounded-xl shimmer-skeleton lg:h-11" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="glass h-32 rounded-3xl border border-white/[0.06] shimmer-skeleton"
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-strong h-80 rounded-3xl border shimmer-skeleton lg:h-96" />
        <div className="glass-strong h-80 rounded-3xl border shimmer-skeleton lg:h-96" />
      </div>
    </div>
  )
}

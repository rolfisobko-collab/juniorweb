export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 bg-muted animate-pulse rounded" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
        <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
      </div>
    </div>
  )
}

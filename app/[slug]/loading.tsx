export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-4 animate-pulse">
          <div className="h-12 bg-muted rounded w-3/4" />
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="space-y-3 mt-8">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
      </div>
    </div>
  )
}

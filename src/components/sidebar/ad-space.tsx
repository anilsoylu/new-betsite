import { cn } from "@/lib/utils"

interface AdSpaceProps {
  className?: string
  size?: "medium-rectangle" | "large-rectangle" | "leaderboard"
  children?: React.ReactNode
}

const sizes = {
  "medium-rectangle": { width: 300, height: 250 },
  "large-rectangle": { width: 336, height: 280 },
  "leaderboard": { width: 728, height: 90 },
}

export function AdSpace({ className, size = "medium-rectangle", children }: AdSpaceProps) {
  const dimensions = sizes[size]

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden flex items-center justify-center",
        className
      )}
      style={{
        minHeight: dimensions.height,
        maxWidth: dimensions.width,
      }}
    >
      {children || (
        <div className="flex flex-col items-center justify-center text-muted-foreground/50 p-4 text-center">
          <span className="text-xs font-medium">Advertisement</span>
          <span className="text-[10px]">{dimensions.width} x {dimensions.height}</span>
        </div>
      )}
    </div>
  )
}

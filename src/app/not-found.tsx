import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE } from "@/lib/constants"

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      {/* 404 Number */}
      <div className="text-9xl font-bold text-muted-foreground/20 select-none">
        404
      </div>

      {/* Message */}
      <h1 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/matches">
            <Search className="h-4 w-4 mr-2" />
            Browse Matches
          </Link>
        </Button>
      </div>

      {/* Quick Links */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">Or try these pages:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/teams"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Teams
          </Link>
          <span className="text-muted-foreground/50">•</span>
          <Link
            href="/players"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Players
          </Link>
          <span className="text-muted-foreground/50">•</span>
          <Link
            href="/matches"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Matches
          </Link>
        </div>
      </div>
    </main>
  )
}

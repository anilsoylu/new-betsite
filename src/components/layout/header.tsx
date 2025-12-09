"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Star } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SITE } from "@/lib/constants"
import { GlobalSearch } from "@/components/layout/global-search"
import { useFavoritesStore } from "@/stores/favorites-store"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/matches", label: "Matches" },
  { href: "/teams", label: "Teams" },
  { href: "/players", label: "Players" },
  { href: "/favorites", label: "Favorites", icon: Star },
]

export function Header() {
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const [hasMounted, setHasMounted] = useState(false)
  const { getTotalCount } = useFavoritesStore()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  const favoriteCount = hasMounted ? getTotalCount() : 0

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {SITE.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const isFavorites = item.href === "/favorites"

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 rounded-md transition-colors flex items-center gap-1.5",
                  isActive
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {isFavorites && (
                  <Star className={cn(
                    "h-4 w-4",
                    isActive && "fill-yellow-500 text-yellow-500"
                  )} />
                )}
                <span>{item.label}</span>
                {/* Favorite count badge */}
                {isFavorites && favoriteCount > 0 && (
                  <span className="ml-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-yellow-500 text-yellow-950 rounded-full flex items-center justify-center">
                    {favoriteCount > 99 ? "99+" : favoriteCount}
                  </span>
                )}
                {/* Active indicator line */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right Side */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Global Search */}
          <GlobalSearch />

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

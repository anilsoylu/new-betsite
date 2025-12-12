import type { Metadata } from "next"
import { SEO, SITE } from "@/lib/constants"

export const metadata: Metadata = {
  title: SEO.favorites.title,
  description: SEO.favorites.description,
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${SITE.url}/favorites`,
  },
}

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

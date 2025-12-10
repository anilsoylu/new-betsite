import type { Metadata } from "next";
import { SEO } from "@/lib/constants";

export const metadata: Metadata = {
  title: SEO.favorites.title,
  description: SEO.favorites.description,
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

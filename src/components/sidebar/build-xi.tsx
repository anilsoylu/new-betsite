"use client"

import Link from "next/link"
import { Users, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BuildXIProps {
  className?: string
}

export function BuildXI({ className }: BuildXIProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      {/* Mini Pitch Background */}
      <div className="relative bg-gradient-to-b from-green-600 to-green-700 p-4">
        {/* Pitch markings */}
        <div className="absolute inset-0 opacity-20">
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white rounded-full" />
          {/* Center line */}
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white" />
          {/* Penalty areas */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 border-2 border-b-0 border-white" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 border-2 border-t-0 border-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center text-white py-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg mb-1">Build Your XI</h3>
          <p className="text-sm text-white/80 mb-4">
            Create your dream starting lineup
          </p>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/build-xi"
        className={cn(
          "flex items-center justify-between px-4 py-3 transition-colors",
          "hover:bg-muted/50 group"
        )}
      >
        <span className="text-sm font-medium">Start Building</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  )
}

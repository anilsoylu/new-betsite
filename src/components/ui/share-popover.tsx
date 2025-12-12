"use client"

import * as React from "react"
import { Share2, Link2, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface SharePopoverProps {
  url?: string
  title: string
  description?: string
  variant?: "default" | "dark"
  className?: string
}

interface ShareOption {
  name: string
  icon: React.ComponentType
  getUrl: (url: string, title: string) => string
  color: string
}

// Social media icons as inline SVGs for better control
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

const shareOptions: Array<ShareOption> = [
  {
    name: "X",
    icon: TwitterIcon,
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    color: "hover:bg-black hover:text-white",
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    color: "hover:bg-[#1877F2] hover:text-white",
  },
  {
    name: "WhatsApp",
    icon: WhatsAppIcon,
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    color: "hover:bg-[#25D366] hover:text-white",
  },
  {
    name: "Telegram",
    icon: TelegramIcon,
    getUrl: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    color: "hover:bg-[#0088cc] hover:text-white",
  },
]

// Detect if user is on a mobile/touch device
function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false

  // Check for touch capability and screen size
  const hasTouchScreen =
    "ontouchstart" in window || navigator.maxTouchPoints > 0

  // Also check user agent for mobile devices
  const mobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  // Consider it mobile if it has touch AND is a mobile user agent
  // This excludes touch-enabled laptops/desktops
  return hasTouchScreen && mobileUserAgent
}

export function SharePopover({
  url,
  title,
  description,
  variant = "default",
  className,
}: SharePopoverProps) {
  const [copied, setCopied] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "")

  async function handleNativeShare(): Promise<boolean> {
    // Only use native share on mobile devices
    if (
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      isMobileDevice()
    ) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: shareUrl,
        })
        return true
      } catch {
        // User cancelled or share failed, fall through to popover
        return false
      }
    }
    return false
  }

  async function handleTriggerClick(e: React.MouseEvent): Promise<void> {
    // Try native share only on mobile devices
    if (
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      isMobileDevice()
    ) {
      e.preventDefault()
      const shared = await handleNativeShare()
      if (shared) return
    }
    // On desktop or if native share failed, popover will open
  }

  async function handleCopyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link copied!")
      setTimeout(() => {
        setCopied(false)
        setOpen(false)
      }, 1500)
    } catch {
      toast.error("Failed to copy link")
    }
  }

  function handleShareClick(
    getUrl: (url: string, title: string) => string
  ): void {
    const shareLink = getUrl(shareUrl, title)
    window.open(shareLink, "_blank", "noopener,noreferrer,width=600,height=400")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={handleTriggerClick}
          className={cn(
            "p-2 rounded-full transition-colors",
            variant === "dark"
              ? "bg-slate-700 hover:bg-slate-600 text-white"
              : "bg-muted hover:bg-muted/80",
            className
          )}
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end" sideOffset={8}>
        <div className="space-y-3">
          <p className="text-sm font-medium text-center text-muted-foreground">
            Share
          </p>

          {/* Social Media Grid */}
          <div className="grid grid-cols-4 gap-2">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => handleShareClick(option.getUrl)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg transition-all",
                  "bg-muted/50 text-foreground",
                  option.color
                )}
                title={option.name}
              >
                <option.icon />
                <span className="text-[10px] font-medium">{option.name}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className={cn(
              "flex items-center justify-center gap-2 w-full p-2.5 rounded-lg transition-all",
              "bg-muted/50 hover:bg-primary hover:text-primary-foreground",
              copied && "bg-green-500 text-white hover:bg-green-500"
            )}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                <span className="text-sm font-medium">Copy Link</span>
              </>
            )}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

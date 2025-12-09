import Image from "next/image"
import { format } from "date-fns"
import { ArrowRight, Repeat, Gift } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PlayerTransfer } from "@/types/football"

interface PlayerTransfersProps {
  transfers: Array<PlayerTransfer>
}

function formatTransferAmount(amount: number | null): string {
  if (!amount) return "Free"
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}K`
  }
  return `€${amount}`
}

function getTransferIcon(type: PlayerTransfer["type"]) {
  switch (type) {
    case "loan":
    case "end_of_loan":
      return <Repeat className="h-3 w-3" />
    case "free":
      return <Gift className="h-3 w-3" />
    default:
      return <ArrowRight className="h-3 w-3" />
  }
}

function getTransferLabel(type: PlayerTransfer["type"]): string {
  switch (type) {
    case "loan":
      return "Loan"
    case "end_of_loan":
      return "End of Loan"
    case "free":
      return "Free Transfer"
    case "permanent":
      return "Transfer"
    default:
      return "Transfer"
  }
}

export function PlayerTransfers({ transfers }: PlayerTransfersProps) {
  if (transfers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transfer History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No transfer history available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Transfer History</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {transfers.length} transfers
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {transfers.map((transfer) => (
            <div key={transfer.id} className="p-3 hover:bg-muted/30 transition-colors">
              {/* Date and Type */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(transfer.date), "MMM d, yyyy")}
                  </span>
                  <Badge variant="outline" className="text-[10px] h-5 gap-1">
                    {getTransferIcon(transfer.type)}
                    {getTransferLabel(transfer.type)}
                  </Badge>
                </div>
                {transfer.amount && transfer.amount > 0 && (
                  <span className="text-xs font-medium text-green-600">
                    {formatTransferAmount(transfer.amount)}
                  </span>
                )}
              </div>

              {/* Teams */}
              <div className="flex items-center gap-2">
                {/* From Team */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {transfer.fromTeamLogo ? (
                    <Image
                      src={transfer.fromTeamLogo}
                      alt={transfer.fromTeamName}
                      width={20}
                      height={20}
                      className="object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                      {transfer.fromTeamName.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm truncate">{transfer.fromTeamName}</span>
                </div>

                {/* Arrow */}
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

                {/* To Team */}
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {transfer.toTeamLogo ? (
                    <Image
                      src={transfer.toTeamLogo}
                      alt={transfer.toTeamName}
                      width={20}
                      height={20}
                      className="object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[10px] font-medium shrink-0">
                      {transfer.toTeamName.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm truncate">{transfer.toTeamName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamById, getTeamTransfers } from "@/lib/api/cached-football-api";
import { extractTeamId, getPlayerUrl } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import type { TeamTransfer } from "@/types/football";
import { SITE, SEO } from "@/lib/constants";

interface TeamTransfersPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TeamTransfersPageProps): Promise<Metadata> {
  const { slug } = await params;
  const teamId = extractTeamId(slug);

  if (!teamId) {
    return { title: "Team Not Found" };
  }

  try {
    const team = await getTeamById(teamId);
    return {
      title: SEO.teamTransfers.titleTemplate(team.name),
      description: SEO.teamTransfers.descriptionTemplate(team.name),
      alternates: {
        canonical: `${SITE.url}/teams/${slug}/transfers`,
      },
    };
  } catch {
    return { title: "Team Not Found" };
  }
}

export default async function TeamTransfersPage({
  params,
}: TeamTransfersPageProps) {
  const { slug } = await params;
  const teamId = extractTeamId(slug);

  if (!teamId) {
    notFound();
  }

  let team;
  let transfersData;

  try {
    [team, transfersData] = await Promise.all([
      getTeamById(teamId),
      getTeamTransfers(teamId),
    ]);
  } catch {
    notFound();
  }

  const { arrivals, departures } = transfersData;

  // Group transfers by year
  const arrivalsByYear = groupTransfersByYear(arrivals);
  const departuresByYear = groupTransfersByYear(departures);

  const hasTransfers = arrivals.length > 0 || departures.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Transfers</h2>
        {hasTransfers && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ArrowRight className="h-4 w-4 text-green-600" />
              {arrivals.length} arrivals
            </span>
            <span className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4 text-red-600" />
              {departures.length} departures
            </span>
          </div>
        )}
      </div>

      {!hasTransfers ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <ArrowRight className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">No Transfers Found</h3>
                <p className="text-muted-foreground max-w-md">
                  No transfer records are available for {team.name} at this
                  time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Arrivals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-green-600" />
                Arrivals ({arrivals.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(arrivalsByYear)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, transfers]) => (
                  <div key={year} className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground border-b pb-1">
                      {year}
                    </h4>
                    <div className="space-y-2">
                      {transfers.map((transfer) => (
                        <TransferRow
                          key={transfer.id}
                          transfer={transfer}
                          type="arrival"
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Departures */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 text-red-600" />
                Departures ({departures.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(departuresByYear)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, transfers]) => (
                  <div key={year} className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground border-b pb-1">
                      {year}
                    </h4>
                    <div className="space-y-2">
                      {transfers.map((transfer) => (
                        <TransferRow
                          key={transfer.id}
                          transfer={transfer}
                          type="departure"
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function TransferRow({
  transfer,
  type,
}: {
  transfer: TeamTransfer;
  type: "arrival" | "departure";
}) {
  const otherTeam =
    type === "arrival"
      ? { name: transfer.fromTeamName, logo: transfer.fromTeamLogo }
      : { name: transfer.toTeamName, logo: transfer.toTeamLogo };

  const playerUrl = getPlayerUrl(transfer.playerName, transfer.playerId);

  return (
    <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors">
      {/* Player Avatar */}
      <Link href={playerUrl}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={transfer.playerImage || undefined} />
          <AvatarFallback className="text-xs">
            {getInitials(transfer.playerName)}
          </AvatarFallback>
        </Avatar>
      </Link>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={playerUrl}
          className="font-medium text-sm hover:underline truncate block"
        >
          {transfer.playerName}
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            {type === "arrival" ? "from" : "to"}
          </span>
          {otherTeam.logo && (
            <Avatar className="h-4 w-4">
              <AvatarImage src={otherTeam.logo} />
              <AvatarFallback className="text-[8px]">
                {otherTeam.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="truncate">{otherTeam.name}</span>
        </div>
      </div>

      {/* Transfer Details */}
      <div className="flex flex-col items-end gap-1">
        <TransferTypeBadge type={transfer.type} />
        {transfer.amount && transfer.amount > 0 && (
          <span className="text-xs font-medium text-green-600">
            {formatTransferFee(transfer.amount)}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {format(new Date(transfer.date), "MMM d")}
        </span>
      </div>
    </div>
  );
}

function TransferTypeBadge({ type }: { type: TeamTransfer["type"] }) {
  const variants: Record<
    TeamTransfer["type"],
    { label: string; className: string }
  > = {
    permanent: {
      label: "Permanent",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    loan: {
      label: "Loan",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    free: {
      label: "Free",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    end_of_loan: {
      label: "End Loan",
      className:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    unknown: {
      label: "Transfer",
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    },
  };

  const variant = variants[type];

  return (
    <Badge
      variant="secondary"
      className={`text-[10px] px-1.5 ${variant.className}`}
    >
      {variant.label}
    </Badge>
  );
}

function groupTransfersByYear(
  transfers: TeamTransfer[],
): Record<string, TeamTransfer[]> {
  return transfers.reduce(
    (acc, transfer) => {
      const year = new Date(transfer.date).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(transfer);
      return acc;
    },
    {} as Record<string, TeamTransfer[]>,
  );
}

function formatTransferFee(amount: number): string {
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}K`;
  }
  return `€${amount}`;
}

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

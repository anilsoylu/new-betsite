"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  BarChart3,
  ArrowLeftRight,
  ArrowRight,
  Repeat,
  Gift,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PlayerSeasonStats, PlayerTransfer } from "@/types/football";
import { getTeamUrl, getLeagueUrl } from "@/lib/utils";

interface PlayerDataTabsProps {
  stats: Array<PlayerSeasonStats>;
  transfers: Array<PlayerTransfer>;
}

function formatTransferAmount(amount: number | null): string {
  if (!amount) return "Free";
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount}`;
}

function getTransferIcon(type: PlayerTransfer["type"]) {
  switch (type) {
    case "loan":
    case "end_of_loan":
      return <Repeat className="h-3 w-3" />;
    case "free":
      return <Gift className="h-3 w-3" />;
    default:
      return <ArrowRight className="h-3 w-3" />;
  }
}

function getTransferLabel(type: PlayerTransfer["type"]): string {
  switch (type) {
    case "loan":
      return "Loan";
    case "end_of_loan":
      return "End of Loan";
    case "free":
      return "Free";
    case "permanent":
      return "Transfer";
    default:
      return "Transfer";
  }
}

export function PlayerDataTabs({ stats, transfers }: PlayerDataTabsProps) {
  // Calculate career totals
  const careerTotals = stats.reduce(
    (acc, s) => ({
      appearances: acc.appearances + s.appearances,
      goals: acc.goals + s.goals,
      assists: acc.assists + s.assists,
      minutesPlayed: acc.minutesPlayed + s.minutesPlayed,
      yellowCards: acc.yellowCards + s.yellowCards,
      redCards: acc.redCards + s.redCards,
    }),
    {
      appearances: 0,
      goals: 0,
      assists: 0,
      minutesPlayed: 0,
      yellowCards: 0,
      redCards: 0,
    },
  );

  return (
    <Card>
      <CardHeader className="pb-0 pt-3 px-3">
        <Tabs defaultValue="statistics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="statistics" className="text-xs gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              Statistics
              {stats.length > 0 && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1 text-[10px] ml-1"
                >
                  {stats.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transfers" className="text-xs gap-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Transfers
              {transfers.length > 0 && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1 text-[10px] ml-1"
                >
                  {transfers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Statistics Tab Content */}
          <TabsContent value="statistics" className="mt-3 -mx-3">
            {stats.length === 0 ? (
              <div className="px-3 pb-3">
                <p className="text-sm text-muted-foreground">
                  No statistics available
                </p>
              </div>
            ) : (
              <>
                {/* Career Summary */}
                <div className="px-3 pb-3 grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xl font-bold">
                      {careerTotals.appearances}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      Matches
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xl font-bold">{careerTotals.goals}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      Goals
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-xl font-bold">{careerTotals.assists}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      Assists
                    </p>
                  </div>
                </div>

                {/* Stats Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-t bg-muted/30">
                        <th className="text-left p-2 font-medium">Season</th>
                        <th className="text-center p-2 font-medium w-10">M</th>
                        <th className="text-center p-2 font-medium w-10">G</th>
                        <th className="text-center p-2 font-medium w-10">A</th>
                        <th className="text-center p-2 font-medium w-14">
                          Min
                        </th>
                        <th className="text-center p-2 font-medium w-10">
                          <span className="inline-block w-2 h-3 bg-yellow-400 rounded-sm" />
                        </th>
                        <th className="text-center p-2 font-medium w-10">
                          <span className="inline-block w-2 h-3 bg-red-500 rounded-sm" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((season) => (
                        <tr
                          key={`${season.seasonId}-${season.teamId}`}
                          className="border-t hover:bg-muted/30"
                        >
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              {season.teamLogo && (
                                <Link
                                  href={getTeamUrl(
                                    season.teamName,
                                    season.teamId,
                                  )}
                                >
                                  <Image
                                    src={season.teamLogo}
                                    alt={season.teamName}
                                    width={16}
                                    height={16}
                                    className="object-contain w-auto h-auto hover:opacity-80"
                                  />
                                </Link>
                              )}
                              <div className="min-w-0">
                                <p className="font-medium truncate">
                                  {season.seasonName}
                                </p>
                                {season.leagueName && season.leagueId && (
                                  <Link
                                    href={getLeagueUrl(
                                      season.leagueName,
                                      season.leagueId,
                                    )}
                                    className="text-[10px] text-muted-foreground truncate block hover:underline"
                                  >
                                    {season.leagueName}
                                  </Link>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center p-2 tabular-nums">
                            {season.appearances || "-"}
                          </td>
                          <td className="text-center p-2 tabular-nums font-medium">
                            {season.goals || "-"}
                          </td>
                          <td className="text-center p-2 tabular-nums">
                            {season.assists || "-"}
                          </td>
                          <td className="text-center p-2 tabular-nums text-muted-foreground">
                            {season.minutesPlayed || "-"}
                          </td>
                          <td className="text-center p-2 tabular-nums">
                            {season.yellowCards || "-"}
                          </td>
                          <td className="text-center p-2 tabular-nums">
                            {season.redCards || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </TabsContent>

          {/* Transfers Tab Content */}
          <TabsContent value="transfers" className="mt-3 -mx-3">
            {transfers.length === 0 ? (
              <div className="px-3 pb-3">
                <p className="text-sm text-muted-foreground">
                  No transfer history available
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {transfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="p-3 hover:bg-muted/30 transition-colors"
                  >
                    {/* Date and Type */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(transfer.date), "MMM d, yyyy")}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 gap-1"
                        >
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
                      <Link
                        href={getTeamUrl(
                          transfer.fromTeamName,
                          transfer.fromTeamId,
                        )}
                        className="flex items-center gap-1.5 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                      >
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
                        <span className="text-sm truncate hover:underline">
                          {transfer.fromTeamName}
                        </span>
                      </Link>

                      {/* Arrow */}
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

                      {/* To Team */}
                      <Link
                        href={getTeamUrl(
                          transfer.toTeamName,
                          transfer.toTeamId,
                        )}
                        className="flex items-center gap-1.5 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                      >
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
                        <span className="text-sm truncate hover:underline">
                          {transfer.toTeamName}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0" />
    </Card>
  );
}

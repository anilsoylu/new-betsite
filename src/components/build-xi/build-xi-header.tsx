"use client";

import { useState } from "react";
import { useBuildXIStore } from "@/stores/build-xi-store";
import { FORMATIONS } from "@/lib/build-xi/formations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Download, Share2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { exportLineupImage } from "@/lib/build-xi/export-image";
import type { LineupMode } from "@/types/build-xi";

export function BuildXIHeader() {
  const [isSharing, setIsSharing] = useState(false);

  const currentLineup = useBuildXIStore((state) => state.currentLineup);
  const setFormation = useBuildXIStore((state) => state.setFormation);
  const setMode = useBuildXIStore((state) => state.setMode);
  const setLineupName = useBuildXIStore((state) => state.setLineupName);
  const clearAllPlayers = useBuildXIStore((state) => state.clearAllPlayers);
  const saveCurrentLineup = useBuildXIStore((state) => state.saveCurrentLineup);
  const getFilledSlotsCount = useBuildXIStore(
    (state) => state.getFilledSlotsCount,
  );

  const filledCount = getFilledSlotsCount();

  const handleShare = async () => {
    if (filledCount === 0) {
      toast.error("Add at least one player to share");
      return;
    }

    setIsSharing(true);

    try {
      // Save lineup to database and get short ID
      const response = await fetch("/api/lineups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineup: currentLineup }),
      });

      if (!response.ok) {
        throw new Error("Failed to save lineup");
      }

      const data = await response.json();
      const fullUrl = `${window.location.origin}${data.url}`;

      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied to clipboard!", {
        description: fullUrl,
      });
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Failed to create share link");
    } finally {
      setIsSharing(false);
    }
  };

  const handleSave = () => {
    const id = saveCurrentLineup();
    if (id) {
      toast.success("Lineup saved!", {
        description: "Find it in your saved lineups",
      });
    } else {
      toast.error("Add at least one player to save");
    }
  };

  const handleClear = () => {
    clearAllPlayers();
    toast("Lineup cleared");
  };

  const handleExport = async () => {
    if (filledCount === 0) {
      toast.error("Add at least one player to export");
      return;
    }

    try {
      toast.loading("Generating image...", { id: "export" });
      await exportLineupImage(currentLineup.name || "my-lineup");
      toast.success("Image downloaded!", { id: "export" });
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export image", { id: "export" });
    }
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        {/* Top Row - Title and Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold sm:text-2xl">Build Your XI</h1>
            <span className="text-sm text-muted-foreground">
              {filledCount}/11
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={filledCount === 0}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={filledCount === 0}
            >
              <Save className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={filledCount === 0 || isSharing}
            >
              {isSharing ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-1" />
              )}
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleExport}
              disabled={filledCount === 0}
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Bottom Row - Formation, Mode, Name */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Formation Selector */}
          <Select
            value={currentLineup.formationId}
            onValueChange={setFormation}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Formation" />
            </SelectTrigger>
            <SelectContent>
              {FORMATIONS.map((formation) => (
                <SelectItem key={formation.id} value={formation.id}>
                  {formation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Club/Country Toggle */}
          <Tabs
            value={currentLineup.mode}
            onValueChange={(value) => setMode(value as LineupMode)}
            className="w-full sm:w-auto"
          >
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="club" className="flex-1 sm:flex-initial">
                Club
              </TabsTrigger>
              <TabsTrigger value="country" className="flex-1 sm:flex-initial">
                Country
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Lineup Name Input */}
          <Input
            placeholder="Lineup name"
            value={currentLineup.name}
            onChange={(e) => setLineupName(e.target.value)}
            className="flex-1 max-w-xs"
          />
        </div>
      </div>
    </header>
  );
}

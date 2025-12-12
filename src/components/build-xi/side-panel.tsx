"use client";

import { useBuildXIStore } from "@/stores/build-xi-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Upload, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function SidePanel() {
  const savedLineups = useBuildXIStore((state) => state.savedLineups);
  const loadLineup = useBuildXIStore((state) => state.loadLineup);
  const deleteLineup = useBuildXIStore((state) => state.deleteLineup);

  const handleLoad = (id: string, name: string) => {
    loadLineup(id);
    toast.success(`Loaded "${name}"`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteLineup(id);
    toast(`Deleted "${name}"`);
  };

  return (
    <div className="space-y-4">
      {/* Instructions Card */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Info className="h-4 w-4" />
            How to Build
          </h2>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. Choose a formation from the dropdown</p>
          <p>2. Click on empty slots to add players</p>
          <p>3. Or select a team to pre-fill all positions</p>
          <p>4. Save your lineup or share it with friends</p>
        </CardContent>
      </Card>

      {/* Saved Lineups */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-base font-semibold">
            Saved Lineups ({savedLineups.length})
          </h2>
        </CardHeader>
        <CardContent>
          {savedLineups.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No saved lineups yet.
              <br />
              Build a lineup and click Save!
            </p>
          ) : (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {savedLineups.map((lineup) => {
                  const filledCount = Object.values(lineup.players).filter(
                    Boolean,
                  ).length;

                  return (
                    <div
                      key={lineup.id}
                      className="flex items-center justify-between p-2 rounded-lg border bg-muted/30"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {lineup.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lineup.formationId} &bull; {filledCount}/11 players
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleLoad(lineup.id, lineup.name)}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(lineup.id, lineup.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts - Desktop only */}
      <Card className="hidden lg:block py-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="shortcuts" className="border-0">
            <AccordionTrigger className="text-sm px-4 py-3">
              Tips & Shortcuts
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-1 px-4">
              <p>&bull; Click filled slots to change or remove players</p>
              <p>&bull; Formation change preserves matching positions</p>
              <p>&bull; Share links work without accounts</p>
              <p>&bull; Export creates a high-quality PNG image</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}

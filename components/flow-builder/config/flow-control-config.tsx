"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FlowControlConfigProps {
  nodeType: string;
  nodeData: any;
  onUpdate: (updatedData: any) => void;
}

export function FlowControlConfig({
  nodeType,
  nodeData,
  onUpdate,
}: FlowControlConfigProps) {
  const [delayMs, setDelayMs] = useState<number>(nodeData?.delayMs || 1000);

  // Update local state when nodeData changes
  useEffect(() => {
    setDelayMs(nodeData?.delayMs || 1000);
  }, [nodeData]);

  const handleSave = () => {
    onUpdate({
      ...nodeData,
      delayMs: delayMs,
    });
  };

  const handleReset = () => {
    setDelayMs(1000);
    onUpdate({
      ...nodeData,
      delayMs: 1000,
    });
  };

  // Render different UI based on node type
  const renderConfig = () => {
    switch (nodeType) {
      case "delay":
        return (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delay-input" className="text-sm font-medium">
                Delay Time (milliseconds)
              </Label>
              <Input
                id="delay-input"
                type="number"
                value={delayMs}
                onChange={(e) => setDelayMs(parseInt(e.target.value) || 0)}
                placeholder="1000"
                min="0"
                step="100"
              />
              <div className="text-xs text-muted-foreground">
                {delayMs >= 1000
                  ? `${(delayMs / 1000).toFixed(1)} seconds`
                  : `${delayMs} milliseconds`}
              </div>
            </div>
          </div>
        );

      case "condition":
        return (
          <div className="p-4 space-y-4">
            <div className="text-center py-6 text-muted-foreground text-sm">
              Condition configuration coming soon...
            </div>
          </div>
        );

      case "start":
      case "end":
        return (
          <div className="p-4 space-y-4">
            <div className="text-center py-6 text-muted-foreground text-sm">
              No configuration needed for {nodeType} node.
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 space-y-4">
            <div className="text-center py-6 text-muted-foreground text-sm">
              Unknown node type: {nodeType}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        {renderConfig()}
      </ScrollArea>

      {/* Action buttons for configurable nodes */}
      {(nodeType === "delay" || nodeType === "condition") && (
        <div className="border-t bg-background p-4">
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              className="min-w-20"
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              className="min-w-20"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
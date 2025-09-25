"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getMethodColor } from "@/constants/color-methods";
import { HTTPMethod } from "@/constants/http-methods";
import { type Endpoint } from "@/store/endpoints";

interface ConfigHeaderProps {
  selectedNode: string | null;
  selectedNodeData?: Endpoint | null;
}

export function ConfigHeader({ selectedNode, selectedNodeData }: ConfigHeaderProps) {
  if (!selectedNode) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">Configuration</h2>
        <Separator className="mt-3" />
        <div className="flex-1 flex items-center justify-center text-muted-foreground mt-6">
          <div className="text-center space-y-2">
            <div className="text-sm">Select an endpoint to configure</div>
            <div className="text-xs">
              Drag an endpoint from the left panel to the canvas
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Step Configuration</h2>
      {selectedNodeData ? (
        <div className="mt-3 space-y-3">
          <div className="space-y-2">
            <Badge
              className={`text-xs font-bold justify-center rounded-sm w-16 h-6 ${getMethodColor(
                selectedNodeData.method as HTTPMethod
              )}`}
            >
              {selectedNodeData.method}
            </Badge>
            <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded font-mono">
              {selectedNodeData.path}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">{selectedNodeData.name}</div>
            {selectedNodeData.description && (
              <div className="text-xs text-muted-foreground mt-1">
                {selectedNodeData.description}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground mt-3">
          Node: {selectedNode || "None selected"}
        </div>
      )}
      <Separator className="mt-3" />
    </div>
  );
}
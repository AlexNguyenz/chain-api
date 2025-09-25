"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { getMethodColor, getMethodCardColor } from "@/constants/color-methods";
import { Badge } from "../ui/badge";
import { HTTPMethod } from "@/constants/http-methods";

interface EndpointData {
  id: string;
  name: string;
  method: HTTPMethod;
  path: string;
  description: string;
  onSelect?: () => void;
}

export const EndpointNode = memo(({ data, selected }: NodeProps) => {
  const endpointData = data as unknown as EndpointData;
  return (
    <div
      className={`p-3 shadow-md rounded-lg border-1 w-[250px] overflow-hidden ${getMethodCardColor(
        endpointData.method
      )} ${selected ? "border-2 bg-background" : ""}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-gray-400"
      />

      <div className="flex items-center justify-between w-full">
        <div className="flex-1 flex-col gap-1 overflow-hidden">
          <p className="font-medium truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {endpointData.path}
          </p>
          <p className="text-sm text-muted-foreground font-medium truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {endpointData.name}
          </p>
        </div>
        <Badge
          className={`text-xs font-bold justify-center rounded-sm w-16 h-6 ${getMethodColor(
            endpointData.method
          )}`}
        >
          {endpointData.method}
        </Badge>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-gray-400"
      />
    </div>
  );
});

EndpointNode.displayName = "EndpointNode";

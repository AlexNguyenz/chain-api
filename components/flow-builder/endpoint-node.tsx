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
      className={`p-3 shadow-md rounded-lg border-1 w-[250px] ${getMethodCardColor(
        endpointData.method
      )} ${selected ? "border-2" : ""}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-gray-400"
      />

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-medium truncate line-clamp-1">
            {endpointData.path}
          </p>
          <p className="text-sm text-muted-foreground font-medium truncate line-clamp-1">
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

"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { getMethodColor, getMethodCardColor } from "@/constants/color-methods";
import { Badge } from "../ui/badge";
import { HTTPMethod } from "@/constants/http-methods";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type ExecutionStatus = "idle" | "loading" | "success" | "error";

interface EndpointData {
  id: string;
  name: string;
  method: HTTPMethod;
  path: string;
  description: string;
  onSelect?: () => void;
  executionStatus?: ExecutionStatus;
  executionTime?: number;
  executionError?: string;
  requestData?: any;
  responseData?: any;
}

export const EndpointNode = memo(({ data, selected }: NodeProps) => {
  const endpointData = data as unknown as EndpointData;

  const getStatusIcon = () => {
    switch (endpointData.executionStatus) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`p-4 shadow-md rounded-lg border-1 w-[250px] relative ${getMethodCardColor(
        endpointData.method
      )} ${selected ? "border-2 bg-background" : ""}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-gray-400"
      />

      {/* Status Icon - positioned at top right */}
      {getStatusIcon() && (
        <div className="absolute top-1 right-2">{getStatusIcon()}</div>
      )}

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

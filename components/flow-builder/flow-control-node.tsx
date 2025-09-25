"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Play, Square, Clock, GitBranch, Repeat } from "lucide-react";

interface FlowControlData {
  id: string;
  name: string;
  type: "start" | "end" | "delay" | "condition" | "loop";
  description: string;
  iconColor: string;
}

const iconMap = {
  start: Play,
  end: Square,
  delay: Clock,
  condition: GitBranch,
  loop: Repeat,
};

export const FlowControlNode = memo(({ data, selected }: NodeProps) => {
  const controlData = data as unknown as FlowControlData;
  const Icon = iconMap[controlData.type];

  // Start and End nodes are circular
  if (controlData.type === "start" || controlData.type === "end") {
    const isStart = controlData.type === "start";
    const circleColor = isStart
      ? "border-green-500 bg-green-50 dark:bg-green-950"
      : "border-red-500 bg-red-50 dark:bg-red-950";
    const iconColor = isStart ? "text-green-600" : "text-red-600";

    const selectedClasses = selected
      ? "border-2 bg-background"
      : "border-1";

    return (
      <div
        className={`w-16 h-16 rounded-full ${circleColor} ${selectedClasses} flex items-center justify-center shadow-md`}
      >
        {!isStart && (
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 !bg-gray-400"
          />
        )}

        <Icon className={`h-6 w-6 ${iconColor}`} />

        {isStart && (
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 !bg-gray-400"
          />
        )}
      </div>
    );
  }

  // Rectangular nodes for Loop, Condition, Delay
  const getRectangleColor = (type: string) => {
    switch (type) {
      case "loop":
        return "border-orange-500 bg-orange-100 dark:bg-orange-950";
      case "condition":
        return "border-yellow-500 bg-yellow-100 dark:bg-yellow-950";
      case "delay":
        return "border-purple-500 bg-purple-100 dark:bg-purple-950";
      default:
        return "border-gray-500 bg-gray-100 dark:bg-gray-950";
    }
  };

  const selectedClasses = selected
    ? "border-2 bg-background"
    : "border-1";

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-lg min-w-[120px] ${getRectangleColor(
        controlData.type
      )} ${selectedClasses}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-400"
      />

      <div className="flex items-center gap-2 justify-center">
        <Icon className={`h-4 w-4 ${controlData.iconColor}`} />
        <span className="font-medium text-sm">{controlData.name}</span>
      </div>

{controlData.type === "condition" ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="w-3 h-3 !bg-gray-400"
            style={{ left: "30%" }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="w-3 h-3 !bg-gray-400"
            style={{ left: "70%" }}
          />
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-gray-400"
        />
      )}
    </div>
  );
});

FlowControlNode.displayName = "FlowControlNode";

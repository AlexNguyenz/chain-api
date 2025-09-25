"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Square,
  Clock,
  GitBranch,
  Repeat
} from "lucide-react";

interface FlowControl {
  id: string;
  name: string;
  type: "start" | "end" | "delay" | "condition" | "loop";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const flowControls: FlowControl[] = [
  {
    id: "start-1",
    name: "Start",
    type: "start",
    description: "Begin the flow execution",
    icon: Play,
    iconColor: "text-green-600",
  },
  {
    id: "end-1",
    name: "End",
    type: "end",
    description: "Terminate the flow",
    icon: Square,
    iconColor: "text-red-600",
  },
  {
    id: "delay-1",
    name: "Delay",
    type: "delay",
    description: "Wait for specified time",
    icon: Clock,
    iconColor: "text-purple-600",
  },
  {
    id: "condition-1",
    name: "Condition",
    type: "condition",
    description: "Branch based on conditions",
    icon: GitBranch,
    iconColor: "text-yellow-600",
  },
  {
    id: "loop-1",
    name: "Loop",
    type: "loop",
    description: "Iterate over items",
    icon: Repeat,
    iconColor: "text-orange-600",
  },
];

export function FlowControlList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredControls = flowControls.filter(
    (control) =>
      control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    control: FlowControl
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        type: "flowControl",
        data: control,
      })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">Utilities</h2>
        <Input
          placeholder="Search utilities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Separator />
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-2">
          {filteredControls.map((control) => {
            const Icon = control.icon;
            return (
              <div
                key={control.id}
                className="group cursor-move hover:bg-muted/50 transition-colors p-2 rounded-lg flex items-center gap-3"
                draggable
                onDragStart={(e) => onDragStart(e, control)}
              >
                <Icon className={`h-5 w-5 ${control.iconColor}`} />
                <span className="text-sm font-medium">{control.name}</span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
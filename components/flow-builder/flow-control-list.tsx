"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitBranch,
  Repeat,
  Filter,
  Shuffle,
  GitMerge,
  Zap
} from "lucide-react";

interface FlowControl {
  id: string;
  name: string;
  type: "conditional" | "loop" | "filter" | "transform" | "merge" | "trigger";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const flowControls: FlowControl[] = [
  {
    id: "conditional-1",
    name: "If/Else",
    type: "conditional",
    description: "Branch flow based on conditions",
    icon: GitBranch,
  },
  {
    id: "loop-1",
    name: "For Each",
    type: "loop",
    description: "Iterate over array elements",
    icon: Repeat,
  },
  {
    id: "filter-1",
    name: "Filter",
    type: "filter",
    description: "Filter data based on criteria",
    icon: Filter,
  },
  {
    id: "transform-1",
    name: "Transform",
    type: "transform",
    description: "Transform data structure",
    icon: Shuffle,
  },
  {
    id: "merge-1",
    name: "Merge",
    type: "merge",
    description: "Merge multiple data sources",
    icon: GitMerge,
  },
  {
    id: "trigger-1",
    name: "Trigger",
    type: "trigger",
    description: "Start flow on event",
    icon: Zap,
  },
];

const typeColors = {
  conditional: "bg-blue-500",
  loop: "bg-purple-500",
  filter: "bg-orange-500",
  transform: "bg-green-500",
  merge: "bg-pink-500",
  trigger: "bg-yellow-500",
};

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
        <h2 className="text-lg font-semibold">Flow Controls</h2>
        <Input
          placeholder="Search controls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Separator />
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-3">
          {filteredControls.map((control) => {
            const Icon = control.icon;
            return (
              <Card
                key={control.id}
                className="group cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={(e) => onDragStart(e, control)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${typeColors[control.type]} text-white`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{control.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {control.description}
                      </div>
                    </div>
                    <Badge variant="secondary">{control.type}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEndpointStore, type Endpoint } from "@/store/endpoints";
import { EndpointItem } from "./endpoint-item";

interface EndpointListProps {
  onEditEndpoint?: (endpoint: Endpoint) => void;
}

export function EndpointList({ onEditEndpoint }: EndpointListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const endpoints = useEndpointStore((state) => state.endpoints);

  const filteredEndpoints = endpoints.filter(
    (endpoint) =>
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    endpoint: Endpoint
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        type: "endpoint",
        data: endpoint,
      })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">Endpoints</h2>
        <Input
          placeholder="Search endpoints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Separator />
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-3">
          {filteredEndpoints.map((endpoint) => (
            <EndpointItem
              key={endpoint.id}
              endpoint={endpoint}
              onEdit={onEditEndpoint}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

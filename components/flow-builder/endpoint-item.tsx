'use client'

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Endpoint, useEndpointStore } from "@/store/endpoints";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const methodVariants = {
  GET: "secondary" as const,
  POST: "default" as const,
  PUT: "outline" as const,
  DELETE: "destructive" as const,
};

interface EndpointItemProps {
  endpoint: Endpoint;
  onEdit?: (endpoint: Endpoint) => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>, endpoint: Endpoint) => void;
}

export function EndpointItem({ endpoint, onEdit, onDragStart }: EndpointItemProps) {
  const removeEndpoint = useEndpointStore((state) => state.removeEndpoint);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this endpoint?")) {
      removeEndpoint(endpoint.id);
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    onDragStart?.(event, endpoint);
  };

  return (
    <Card
      className="group cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={handleDragStart}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <span className="font-medium">{endpoint.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={methodVariants[endpoint.method]}>
              {endpoint.method}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(endpoint)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-1">
          {endpoint.path}
        </div>
        <div className="text-xs text-muted-foreground">
          {endpoint.description}
        </div>
      </CardContent>
    </Card>
  );
}
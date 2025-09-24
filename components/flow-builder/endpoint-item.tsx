"use client";

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
import { getMethodColor, getMethodCardColor } from "@/constants/color-methods";
import { cn } from "@/lib/utils";

interface EndpointItemProps {
  endpoint: Endpoint;
  onEdit?: (endpoint: Endpoint) => void;
  onDragStart?: (
    event: React.DragEvent<HTMLDivElement>,
    endpoint: Endpoint
  ) => void;
}

export function EndpointItem({
  endpoint,
  onEdit,
  onDragStart,
}: EndpointItemProps) {
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
      className={`group cursor-move hover:shadow-md transition-shadow border-2 py-0 ${getMethodCardColor(
        endpoint.method
      )}`}
      draggable
      onDragStart={handleDragStart}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium truncate line-clamp-1">{endpoint.path}</p>
            <p className="text-sm text-muted-foreground font-medium truncate line-clamp-1">
              {endpoint.name}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Badge
              className={cn(
                "text-xs font-bold justify-center rounded-sm w-16 h-6",
                getMethodColor(endpoint.method)
              )}
            >
              {endpoint.method}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="link"
                  size="sm"
                  className="!p-1 bg-transparent cursor-pointer"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(endpoint)}>
                  <Edit className="h-4 w-4 mr-2 text-accent-foreground" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

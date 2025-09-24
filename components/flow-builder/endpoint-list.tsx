"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Endpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
}

const sampleEndpoints: Endpoint[] = [
  {
    id: "1",
    name: "Get Users",
    method: "GET",
    path: "/api/users",
    description: "Retrieve all users",
  },
  {
    id: "2",
    name: "Create User",
    method: "POST",
    path: "/api/users",
    description: "Create a new user",
  },
  {
    id: "3",
    name: "Update User",
    method: "PUT",
    path: "/api/users/:id",
    description: "Update user information",
  },
  {
    id: "4",
    name: "Delete User",
    method: "DELETE",
    path: "/api/users/:id",
    description: "Delete a user",
  },
  {
    id: "5",
    name: "Get Posts",
    method: "GET",
    path: "/api/posts",
    description: "Retrieve all posts",
  },
  {
    id: "6",
    name: "Get Users",
    method: "GET",
    path: "/api/users",
    description: "Retrieve all users",
  },
  {
    id: "7",
    name: "Create User",
    method: "POST",
    path: "/api/users",
    description: "Create a new user",
  },
  {
    id: "8",
    name: "Update User",
    method: "PUT",
    path: "/api/users/:id",
    description: "Update user information",
  },
  {
    id: "9",
    name: "Delete User",
    method: "DELETE",
    path: "/api/users/:id",
    description: "Delete a user",
  },
  {
    id: "10",
    name: "Get Posts",
    method: "GET",
    path: "/api/posts",
    description: "Retrieve all posts",
  },
];

const methodVariants = {
  GET: "secondary" as const,
  POST: "default" as const,
  PUT: "outline" as const,
  DELETE: "destructive" as const,
};

export function EndpointList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEndpoints = sampleEndpoints.filter(
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
            <Card
              key={endpoint.id}
              draggable
              onDragStart={(event) => onDragStart(event, endpoint)}
              className="cursor-move hover:shadow-md transition-shadow"
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {endpoint.name}
                  </span>
                  <Badge variant={methodVariants[endpoint.method]}>
                    {endpoint.method}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-1">{endpoint.path}</div>
                <div className="text-xs text-muted-foreground">
                  {endpoint.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

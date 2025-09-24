"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const methodColors = {
  GET: "bg-green-100 text-green-800",
  POST: "bg-blue-100 text-blue-800",
  PUT: "bg-yellow-100 text-yellow-800",
  DELETE: "bg-red-100 text-red-800",
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
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Endpoints</h2>
        <input
          type="text"
          placeholder="Search endpoints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-3">
          {filteredEndpoints.map((endpoint) => (
            <div
              key={endpoint.id}
              draggable
              onDragStart={(event) => onDragStart(event, endpoint)}
              className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {endpoint.name}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    methodColors[endpoint.method]
                  }`}
                >
                  {endpoint.method}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-1">{endpoint.path}</div>
              <div className="text-xs text-gray-500">
                {endpoint.description}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

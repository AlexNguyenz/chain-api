import { HTTPMethod } from "@/constants/http-methods";
import { create } from "zustand";

export interface Endpoint {
  id: string;
  name: string;
  method: HTTPMethod;
  path: string;
  description: string;
}

interface EndpointStore {
  endpoints: Endpoint[];
  addEndpoint: (endpoint: Omit<Endpoint, "id">) => void;
  removeEndpoint: (id: string) => void;
  updateEndpoint: (id: string, endpoint: Partial<Endpoint>) => void;
}

export const useEndpointStore = create<EndpointStore>((set) => ({
  endpoints: [
    {
      id: "1",
      name: "Find pet by status",
      method: "GET",
      path: "https://petstore.swagger.io/v2/pet/findByStatus?status=available",
      description: "Retrieve all users",
    },
    {
      id: "2",
      name: "Get store inventory",
      method: "GET",
      path: "https://petstore.swagger.io/v2/store/inventory",
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
  ],

  addEndpoint: (endpoint) =>
    set((state) => ({
      endpoints: [
        ...state.endpoints,
        {
          ...endpoint,
          id: Date.now().toString(),
        },
      ],
    })),

  removeEndpoint: (id) =>
    set((state) => ({
      endpoints: state.endpoints.filter((endpoint) => endpoint.id !== id),
    })),

  updateEndpoint: (id, updatedEndpoint) =>
    set((state) => ({
      endpoints: state.endpoints.map((endpoint) =>
        endpoint.id === id ? { ...endpoint, ...updatedEndpoint } : endpoint
      ),
    })),
}));

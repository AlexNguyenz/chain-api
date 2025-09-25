import { create } from "zustand";

export interface Endpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
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

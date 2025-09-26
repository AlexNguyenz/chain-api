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
  endpoints: [],

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

import { create } from "zustand";
import { Node, Edge } from "@xyflow/react";

export interface Variable {
  name: string;
  value: string;
  description?: string;
  extractionPath?: string; // For $.data.message syntax
}

export interface EndpointConfig {
  baseUrl?: string;
  pathVariables?: Record<string, string>;
  queryParameters?: Array<{ key: string; value: string; enabled: boolean; description?: string }>;
  headers?: Array<{ key: string; value: string; enabled: boolean; description?: string }>;
  body?: {
    type: 'form-data' | 'raw' | 'x-www-form-urlencoded' | 'binary';
    content: string;
    formData?: Array<{
      key: string;
      value: string;
      type: 'text' | 'file';
      enabled: boolean;
      description?: string;
      file?: File; // Store actual File object for file type
    }>;
  };
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  variables: Variable[];
  endpointConfigs: Record<string, EndpointConfig>; // nodeId -> config
  createdAt: Date;
  updatedAt: Date;
}

interface TemplateStore {
  templates: Template[];
  selectedTemplate: Template | null;
  addTemplate: (template: Omit<Template, "id" | "createdAt" | "updatedAt">) => void;
  updateTemplate: (id: string, updates: Partial<Omit<Template, "id" | "createdAt">>) => void;
  deleteTemplate: (id: string) => void;
  selectTemplate: (template: Template | null) => void;
  updateTemplateFlow: (id: string, nodes: Node[], edges: Edge[]) => void;
  addVariable: (templateId: string, variable: Variable) => void;
  updateVariable: (templateId: string, oldName: string, variable: Variable) => void;
  deleteVariable: (templateId: string, name: string) => void;
  updateEndpointConfig: (templateId: string, nodeId: string, config: EndpointConfig) => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  selectedTemplate: null,

  addTemplate: (template) =>
    set((state) => {
      const now = new Date();
      const newTemplate: Template = {
        ...template,
        id: Date.now().toString(),
        variables: template.variables || [],
        endpointConfigs: template.endpointConfigs || {},
        createdAt: now,
        updatedAt: now,
      };
      return {
        templates: [...state.templates, newTemplate],
        selectedTemplate: newTemplate,
      };
    }),

  updateTemplate: (id, updates) =>
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === id
          ? { ...template, ...updates, updatedAt: new Date() }
          : template
      ),
      selectedTemplate:
        state.selectedTemplate?.id === id
          ? { ...state.selectedTemplate, ...updates, updatedAt: new Date() }
          : state.selectedTemplate,
    })),

  deleteTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
      selectedTemplate:
        state.selectedTemplate?.id === id ? null : state.selectedTemplate,
    })),

  selectTemplate: (template) =>
    set((state) => {
      // Find the most up-to-date version of the template from the templates array
      const latestTemplate = template ? state.templates.find(t => t.id === template.id) || template : null;
      return {
        selectedTemplate: latestTemplate,
      };
    }),

  updateTemplateFlow: (id, nodes, edges) =>
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === id
          ? { ...template, nodes, edges, updatedAt: new Date() }
          : template
      ),
      selectedTemplate:
        state.selectedTemplate?.id === id
          ? { ...state.selectedTemplate, nodes, edges, updatedAt: new Date() }
          : state.selectedTemplate,
    })),

  addVariable: (templateId, variable) =>
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === templateId
          ? { ...template, variables: [...template.variables, variable], updatedAt: new Date() }
          : template
      ),
      selectedTemplate:
        state.selectedTemplate?.id === templateId
          ? { ...state.selectedTemplate, variables: [...state.selectedTemplate.variables, variable], updatedAt: new Date() }
          : state.selectedTemplate,
    })),

  updateVariable: (templateId, oldName, variable) =>
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              variables: template.variables.map(v => v.name === oldName ? variable : v),
              updatedAt: new Date()
            }
          : template
      ),
      selectedTemplate:
        state.selectedTemplate?.id === templateId
          ? {
              ...state.selectedTemplate,
              variables: state.selectedTemplate.variables.map(v => v.name === oldName ? variable : v),
              updatedAt: new Date()
            }
          : state.selectedTemplate,
    })),

  deleteVariable: (templateId, name) =>
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              variables: template.variables.filter(v => v.name !== name),
              updatedAt: new Date()
            }
          : template
      ),
      selectedTemplate:
        state.selectedTemplate?.id === templateId
          ? {
              ...state.selectedTemplate,
              variables: state.selectedTemplate.variables.filter(v => v.name !== name),
              updatedAt: new Date()
            }
          : state.selectedTemplate,
    })),

  updateEndpointConfig: (templateId, nodeId, config) =>
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === templateId
          ? {
              ...template,
              endpointConfigs: { ...template.endpointConfigs, [nodeId]: config },
              updatedAt: new Date()
            }
          : template
      ),
      selectedTemplate:
        state.selectedTemplate?.id === templateId
          ? {
              ...state.selectedTemplate,
              endpointConfigs: { ...state.selectedTemplate.endpointConfigs, [nodeId]: config },
              updatedAt: new Date()
            }
          : state.selectedTemplate,
    })),
}));
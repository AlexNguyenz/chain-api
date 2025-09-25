import { create } from "zustand";
import { Node, Edge } from "@xyflow/react";

export interface Template {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
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
}));
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Trash2 } from "lucide-react";
import { useTemplateStore } from "@/store/templates";
import { cn } from "@/lib/utils";

export function TemplatesTab() {
  const { templates, selectedTemplate, selectTemplate, deleteTemplate } =
    useTemplateStore();

  const handleTemplateSelect = (template: any) => {
    console.log(
      "Selecting template:",
      template.name,
      "with nodes:",
      template.nodes.length,
      "edges:",
      template.edges.length
    );
    selectTemplate(template);
  };

  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this template?")) {
      deleteTemplate(templateId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Templates</h2>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {templates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-2">No templates yet</div>
            <div className="text-sm">
              Create your first template using the &quot;New Template&quot; button above
              to start building API chains
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50",
                  selectedTemplate?.id === template.id
                    ? "border-black bg-gray-50"
                    : "border-gray-200"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 truncate">
                      {template.name}
                    </h3>
                    {template.description && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(template.createdAt)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteTemplate(template.id, e)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span>{template.nodes.length} nodes</span>
                  <span>{template.edges.length} connections</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

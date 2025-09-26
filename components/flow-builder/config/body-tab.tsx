"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Upload } from "lucide-react";
import { VariableInput } from "@/components/ui/variable-input";
import type { Variable } from "@/store/templates";

interface BodyTabProps {
  bodyConfig: {
    type: "form-data" | "raw" | "x-www-form-urlencoded" | "binary";
    content: string;
    formData?: Array<{
      key: string;
      value: string;
      type: "text" | "file";
      enabled: boolean;
      description?: string;
      file?: File;
    }>;
  };
  variables: Variable[];
  onUpdateBody: (config: {
    type: "form-data" | "raw" | "x-www-form-urlencoded" | "binary";
    content: string;
    formData?: Array<{
      key: string;
      value: string;
      type: "text" | "file";
      enabled: boolean;
      description?: string;
      file?: File;
    }>;
  }) => void;
}

export function BodyTab({ bodyConfig, variables, onUpdateBody }: BodyTabProps) {
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({});

  const handleTypeChange = (type: "form-data" | "raw" | "x-www-form-urlencoded" | "binary") => {
    if (type === "form-data" && !bodyConfig.formData) {
      onUpdateBody({
        ...bodyConfig,
        type,
        formData: []
      });
    } else {
      onUpdateBody({
        ...bodyConfig,
        type
      });
    }
  };

  const handleRawContentChange = (content: string) => {
    onUpdateBody({
      ...bodyConfig,
      content
    });
  };

  const addFormDataField = () => {
    const newFormData = [
      ...(bodyConfig.formData || []),
      {
        key: "",
        value: "",
        type: "text" as const,
        enabled: true,
        description: ""
      }
    ];

    onUpdateBody({
      ...bodyConfig,
      formData: newFormData
    });
  };

  const removeFormDataField = (index: number) => {
    const newFormData = (bodyConfig.formData || []).filter((_, i) => i !== index);
    onUpdateBody({
      ...bodyConfig,
      formData: newFormData
    });

    // Remove selected file
    if (selectedFiles[index]) {
      const newSelectedFiles = { ...selectedFiles };
      delete newSelectedFiles[index];
      setSelectedFiles(newSelectedFiles);
    }
  };

  const updateFormDataField = (index: number, field: string, value: string | boolean) => {
    const newFormData = (bodyConfig.formData || []).map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: value };

        // If changing type from file to text, clear the selected file
        if (field === "type" && value === "text" && item.type === "file") {
          updated.value = "";
          updated.file = undefined; // Clear stored file
          const newSelectedFiles = { ...selectedFiles };
          delete newSelectedFiles[index];
          setSelectedFiles(newSelectedFiles);
        }

        return updated;
      }
      return item;
    });

    onUpdateBody({
      ...bodyConfig,
      formData: newFormData
    });
  };

  const handleFileSelect = (index: number, file: File | null) => {
    setSelectedFiles(prev => ({
      ...prev,
      [index]: file
    }));

    if (file) {
      // Update both the display name and store the File object
      const newFormData = (bodyConfig.formData || []).map((item, i) => {
        if (i === index) {
          return {
            ...item,
            value: file.name,
            file: file
          };
        }
        return item;
      });

      onUpdateBody({
        ...bodyConfig,
        formData: newFormData
      });
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
          {/* Body Type Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Body Type</Label>
            <Select value={bodyConfig.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select body type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="raw">Raw (JSON)</SelectItem>
                <SelectItem value="form-data">Form Data</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Raw Content */}
          {bodyConfig.type === "raw" && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Raw Content (JSON)</Label>
              <Textarea
                placeholder='{\n  "key": "value",\n  "array": [1, 2, 3]\n}'
                value={bodyConfig.content}
                onChange={(e) => handleRawContentChange(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Enter raw JSON content manually
              </div>
            </div>
          )}

          {/* Form Data */}
          {bodyConfig.type === "form-data" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Form Data Fields</Label>
                <Button
                  onClick={addFormDataField}
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Field
                </Button>
              </div>

              {(!bodyConfig.formData || bodyConfig.formData.length === 0) ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No form data fields yet. Click &quot;Add Field&quot; to get started.
                </div>
              ) : (
                <div className="space-y-3">
                  {bodyConfig.formData.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      {/* Checkbox */}
                      <div className="flex-shrink-0">
                        <Checkbox
                          checked={field.enabled}
                          onCheckedChange={(checked) =>
                            updateFormDataField(index, "enabled", !!checked)
                          }
                        />
                      </div>

                      {/* Field Name */}
                      <div className="w-32 flex-shrink-0">
                        <Input
                          placeholder="Field name"
                          value={field.key}
                          onChange={(e) =>
                            updateFormDataField(index, "key", e.target.value)
                          }
                          className="h-8"
                        />
                      </div>

                      {/* Type Selector */}
                      <div className="w-20 flex-shrink-0">
                        <Select
                          value={field.type}
                          onValueChange={(value) =>
                            updateFormDataField(index, "type", value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Value Field */}
                      <div className="flex-1 min-w-0">
                        {field.type === "text" ? (
                          <VariableInput
                            placeholder="Field value"
                            value={field.value}
                            onChange={(value) => updateFormDataField(index, "value", value)}
                            variables={variables}
                            className="h-8"
                          />
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              placeholder="No file selected"
                              value={selectedFiles[index]?.name || field.value}
                              readOnly
                              className="h-8 flex-1"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2 flex-shrink-0"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  handleFileSelect(index, file || null);
                                };
                                input.click();
                              }}
                            >
                              <Upload className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <div className="flex-shrink-0">
                        <Button
                          onClick={() => removeFormDataField(index)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
      </div>
    </ScrollArea>
  );
}
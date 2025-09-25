"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";
import { VariableInput } from "@/components/ui/variable-input";
import type { Variable } from "@/store/templates";

interface HeadersTabProps {
  headers: Array<{
    key: string;
    value: string;
    description?: string;
    enabled: boolean;
  }>;
  variables: Variable[];
  onAddHeader: () => void;
  onRemoveHeader: (index: number) => void;
  onUpdateHeader: (
    index: number,
    field: string,
    value: string | boolean
  ) => void;
}

export function HeadersTab({
  headers,
  variables,
  onAddHeader,
  onRemoveHeader,
  onUpdateHeader,
}: HeadersTabProps) {
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Headers Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Headers</Label>
              <Button
                onClick={onAddHeader}
                size="sm"
                variant="outline"
                className="h-7 px-2"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Header
              </Button>
            </div>

            {headers.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No headers added yet. Click &quot;Add Header&quot; to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {headers.map((header, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg"
                  >
                    <div className="col-span-1 flex items-center justify-center pt-2">
                      <Checkbox
                        checked={header.enabled}
                        onCheckedChange={(checked) =>
                          onUpdateHeader(index, "enabled", !!checked)
                        }
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        placeholder="Header name"
                        value={header.key}
                        onChange={(e) =>
                          onUpdateHeader(index, "key", e.target.value)
                        }
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-5">
                      <VariableInput
                        placeholder="Header value"
                        value={header.value}
                        onChange={(value) =>
                          onUpdateHeader(index, "value", value)
                        }
                        variables={variables}
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center pt-1">
                      <Button
                        onClick={() => onRemoveHeader(index)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Common Headers Helper */}
          {headers.length > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Common Headers
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => {
                      onAddHeader();
                      const newIndex = headers.length;
                      setTimeout(() => {
                        onUpdateHeader(newIndex, "key", "Content-Type");
                        onUpdateHeader(newIndex, "value", "application/json");
                      }, 0);
                    }}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                  >
                    + Content-Type
                  </Button>
                  <Button
                    onClick={() => {
                      onAddHeader();
                      const newIndex = headers.length;
                      setTimeout(() => {
                        onUpdateHeader(newIndex, "key", "Accept");
                        onUpdateHeader(newIndex, "value", "application/json");
                      }, 0);
                    }}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                  >
                    + Accept
                  </Button>
                  <Button
                    onClick={() => {
                      onAddHeader();
                      const newIndex = headers.length;
                      setTimeout(() => {
                        onUpdateHeader(newIndex, "key", "User-Agent");
                        onUpdateHeader(
                          newIndex,
                          "value",
                          "API-Chain-Builder/1.0"
                        );
                      }, 0);
                    }}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                  >
                    + User-Agent
                  </Button>
                  <Button
                    onClick={() => {
                      onAddHeader();
                      const newIndex = headers.length;
                      setTimeout(() => {
                        onUpdateHeader(newIndex, "key", "Authorization");
                        onUpdateHeader(newIndex, "value", "Bearer {{token}}");
                      }, 0);
                    }}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                  >
                    + Authorization
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

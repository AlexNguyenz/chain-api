"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { VariableInput } from "@/components/ui/variable-input";
import { type Variable } from "@/store/templates";
import { Trash2 } from "lucide-react";

interface PathVariable {
  key: string;
  value: string;
  description?: string;
  enabled: boolean;
}

interface PathVariablesProps {
  pathParams: PathVariable[];
  variables: Variable[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: string | boolean) => void;
}

export function PathVariables({
  pathParams,
  variables,
  onAdd,
  onRemove,
  onUpdate,
}: PathVariablesProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Path Variables</h4>
      <div className="space-y-2">
        {/* Header row */}
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500">
          <div className="col-span-1"></div>
          <div className="col-span-4">Key</div>
          <div className="col-span-4">Value</div>
          <div className="col-span-3">Description</div>
        </div>

        {/* Path Parameter Rows */}
        {pathParams.length > 0 ? (
          pathParams.map((param, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 flex justify-center">
                <Checkbox
                  checked={param.enabled}
                  onCheckedChange={(checked) =>
                    onUpdate(index, "enabled", checked)
                  }
                />
              </div>
              <div className="col-span-4">
                <Input
                  placeholder=":id"
                  value={param.key}
                  onChange={(e) => onUpdate(index, "key", e.target.value)}
                  className="text-sm font-mono"
                />
              </div>
              <div className="col-span-4">
                <VariableInput
                  placeholder="123"
                  value={param.value}
                  onChange={(value) => onUpdate(index, "value", value)}
                  variables={variables}
                  enableVariables={true}
                />
              </div>
              <div className="col-span-2">
                <Input
                  placeholder="Description"
                  value={param.description || ""}
                  onChange={(e) =>
                    onUpdate(index, "description", e.target.value)
                  }
                  className="text-sm"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}

        {/* Add Path Variable Button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAdd}
            className="text-blue-600 hover:text-blue-700"
          >
            + Add Path Variable
          </Button>
        </div>
      </div>
    </div>
  );
}

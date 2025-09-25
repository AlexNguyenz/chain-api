"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Variable } from "@/store/templates";

interface VariablesTabProps {
  variables: Variable[];
  newVariable: Variable;
  onNewVariableChange: (variable: Variable) => void;
  onAddVariable: () => void;
  onDeleteVariable: (name: string) => void;
}

export function VariablesTab({
  variables,
  newVariable,
  onNewVariableChange,
  onAddVariable,
  onDeleteVariable,
}: VariablesTabProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Add New Variable */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Variable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newVariable.name}
                onChange={(e) =>
                  onNewVariableChange({
                    ...newVariable,
                    name: e.target.value,
                  })
                }
                placeholder="variableName"
              />
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                value={newVariable.value}
                onChange={(e) =>
                  onNewVariableChange({
                    ...newVariable,
                    value: e.target.value,
                  })
                }
                placeholder="Fixed value or $.data.message"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={newVariable.description || ""}
                onChange={(e) =>
                  onNewVariableChange({
                    ...newVariable,
                    description: e.target.value,
                  })
                }
                placeholder="Variable description"
              />
            </div>
            <Button
              onClick={onAddVariable}
              disabled={!newVariable.name || !newVariable.value}
              className="w-full"
            >
              Add Variable
            </Button>
          </CardContent>
        </Card>

        {/* Variables List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Variables ({variables.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {variables.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No variables defined yet
              </div>
            ) : (
              <div className="space-y-3">
                {variables.map((variable, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {variable.name}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteVariable(variable.name)}
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {variable.value}
                    </div>
                    {variable.description && (
                      <div className="text-xs text-muted-foreground">
                        {variable.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTemplateStore, ConditionConfig } from "@/store/templates";

interface FlowControlConfigProps {
  nodeType: string;
  nodeData: any;
  nodeId: string;
  onUpdate: (updatedData: any) => void;
}

export function FlowControlConfig({
  nodeType,
  nodeData,
  nodeId,
  onUpdate,
}: FlowControlConfigProps) {
  const [delayMs, setDelayMs] = useState<number>(nodeData?.delayMs || 1000);
  const { selectedTemplate, updateConditionConfig } = useTemplateStore();

  // Condition config state
  const [conditionConfig, setConditionConfig] = useState<ConditionConfig>(() => {
    const existingConfig = selectedTemplate?.conditionConfigs?.[nodeId];
    return existingConfig || {
      extractionPath: '',
      operator: 'equals',
      expectedValue: ''
    };
  });

  // Update local state when nodeData changes
  useEffect(() => {
    setDelayMs(nodeData?.delayMs || 1000);
  }, [nodeData]);

  // Update condition config when template changes
  useEffect(() => {
    if (selectedTemplate?.conditionConfigs?.[nodeId]) {
      setConditionConfig(selectedTemplate.conditionConfigs[nodeId]);
    }
  }, [selectedTemplate, nodeId]);

  const handleSave = () => {
    if (nodeType === "delay") {
      onUpdate({
        ...nodeData,
        delayMs: delayMs,
      });
    } else if (nodeType === "condition") {
      // Save condition config to template store
      if (selectedTemplate) {
        updateConditionConfig(selectedTemplate.id, nodeId, conditionConfig);
      }
    }
  };

  const handleReset = () => {
    if (nodeType === "delay") {
      setDelayMs(1000);
      onUpdate({
        ...nodeData,
        delayMs: 1000,
      });
    } else if (nodeType === "condition") {
      const defaultConfig: ConditionConfig = {
        extractionPath: '',
        operator: 'equals',
        expectedValue: ''
      };
      setConditionConfig(defaultConfig);
      if (selectedTemplate) {
        updateConditionConfig(selectedTemplate.id, nodeId, defaultConfig);
      }
    }
  };

  // Render different UI based on node type
  const renderConfig = () => {
    switch (nodeType) {
      case "delay":
        return (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delay-input" className="text-sm font-medium">
                Delay Time (milliseconds)
              </Label>
              <Input
                id="delay-input"
                type="number"
                value={delayMs}
                onChange={(e) => setDelayMs(parseInt(e.target.value) || 0)}
                placeholder="1000"
                min="0"
                step="100"
              />
              <div className="text-xs text-muted-foreground">
                {delayMs >= 1000
                  ? `${(delayMs / 1000).toFixed(1)} seconds`
                  : `${delayMs} milliseconds`}
              </div>
            </div>
          </div>
        );

      case "condition":
        return (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="extraction-path" className="text-sm font-medium">
                Extraction Path
              </Label>
              <Input
                id="extraction-path"
                type="text"
                value={conditionConfig.extractionPath}
                onChange={(e) => setConditionConfig(prev => ({ ...prev, extractionPath: e.target.value }))}
                placeholder="$.data.status"
                className="font-mono text-sm"
              />
              <div className="text-xs text-muted-foreground">
                JSONPath to extract value from previous response (e.g., $.data.status, $.message)
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operator" className="text-sm font-medium">
                Operator
              </Label>
              <Select
                value={conditionConfig.operator}
                onValueChange={(value) => setConditionConfig(prev => ({ ...prev, operator: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="not_contains">Not Contains</SelectItem>
                  <SelectItem value="exists">Exists</SelectItem>
                  <SelectItem value="not_exists">Not Exists</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!['exists', 'not_exists'].includes(conditionConfig.operator) && (
              <div className="space-y-2">
                <Label htmlFor="expected-value" className="text-sm font-medium">
                  Expected Value
                </Label>
                <Input
                  id="expected-value"
                  type="text"
                  value={conditionConfig.expectedValue}
                  onChange={(e) => setConditionConfig(prev => ({ ...prev, expectedValue: e.target.value }))}
                  placeholder="success"
                />
                <div className="text-xs text-muted-foreground">
                  Value to compare against (not needed for exists/not_exists operators)
                </div>
              </div>
            )}

            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-2">How it works:</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• <span className="text-green-600 font-medium">True path (right)</span>: When condition is met</div>
                <div>• <span className="text-red-600 font-medium">False path (left)</span>: When condition fails</div>
                <div>• Extraction path uses previous API response data</div>
              </div>
            </div>
          </div>
        );

      case "start":
      case "end":
        return (
          <div className="p-4 space-y-4">
            <div className="text-center py-6 text-muted-foreground text-sm">
              No configuration needed for {nodeType} node.
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 space-y-4">
            <div className="text-center py-6 text-muted-foreground text-sm">
              Unknown node type: {nodeType}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        {renderConfig()}
      </ScrollArea>

      {/* Action buttons for configurable nodes */}
      {(nodeType === "delay" || nodeType === "condition") && (
        <div className="border-t bg-background p-4">
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              className="min-w-20"
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              className="min-w-20"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
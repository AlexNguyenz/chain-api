"use client";

import { useState } from "react";
import { Node, Edge } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTemplateStore } from "@/store/templates";
import {
  Play,
  Square,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { APIChainExecutor, ExecutionStep, ExecutionResult } from "@/lib/execution-engine";
import { cn } from "@/lib/utils";

interface FlowExecutorProps {
  nodes: Node[];
  edges: Edge[];
}

const statusIcons = {
  pending: Clock,
  running: Loader2,
  completed: CheckCircle,
  failed: XCircle,
  skipped: AlertCircle,
};

const statusColors = {
  pending: "text-gray-500",
  running: "text-blue-500",
  completed: "text-green-500",
  failed: "text-red-500",
  skipped: "text-yellow-500",
};

export function FlowExecutor({ nodes, edges }: FlowExecutorProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [initialData, setInitialData] = useState("{}");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const { selectedTemplate, templates } = useTemplateStore();

  const handleExecute = async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      // Parse initial data
      let parsedInitialData = null;
      if (initialData.trim()) {
        try {
          parsedInitialData = JSON.parse(initialData);
        } catch (error) {
          throw new Error("Invalid JSON in initial data");
        }
      }

      // Get fresh template from store to ensure latest variables
      const freshTemplate = selectedTemplate ? templates.find(t => t.id === selectedTemplate.id) || selectedTemplate : undefined;

      // Tạo executor và chạy
      const executor = new APIChainExecutor(nodes, edges, freshTemplate);
      const result = await executor.execute(parsedInitialData);

      setExecutionResult(result);
    } catch (error) {
      setExecutionResult({
        success: false,
        steps: [],
        error: error instanceof Error ? error.message : "Unknown error",
        executionTime: 0,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleStop = () => {
    setIsExecuting(false);
    // TODO: Implement execution cancellation
  };

  const formatExecutionTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStepDuration = (step: ExecutionStep): string => {
    if (!step.startTime || !step.endTime) return "N/A";
    return formatExecutionTime(step.endTime - step.startTime);
  };

  const renderStepResult = (step: ExecutionStep) => {
    if (!step.result && !step.error) return null;

    return (
      <div className="mt-2 p-3 bg-muted rounded-lg">
        {step.error && (
          <div className="text-red-600 text-sm font-medium mb-2">
            Error: {step.error}
          </div>
        )}
        {step.result && (
          <div>
            <div className="text-sm font-medium mb-1">Result:</div>
            <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
              {JSON.stringify(step.result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Flow Execution</h2>
          <div className="flex gap-2">
            <Button
              onClick={handleExecute}
              disabled={isExecuting || nodes.length === 0}
              size="sm"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute
                </>
              )}
            </Button>
            {isExecuting && (
              <Button onClick={handleStop} variant="destructive" size="sm">
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            )}
          </div>
        </div>

        {/* Initial Data Input */}
        <div className="space-y-2">
          <Label htmlFor="initialData">Initial Data (JSON)</Label>
          <Textarea
            id="initialData"
            placeholder='{"key": "value"}'
            value={initialData}
            onChange={(e) => setInitialData(e.target.value)}
            rows={3}
            className="font-mono text-sm"
            disabled={isExecuting}
          />
        </div>

        <Separator />
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-4">
          {/* Execution Summary */}
          {executionResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {executionResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Execution {executionResult.success ? "Completed" : "Failed"}
                  <Badge variant={executionResult.success ? "default" : "destructive"}>
                    {formatExecutionTime(executionResult.executionTime)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {executionResult.error && (
                  <div className="text-red-600 mb-4">
                    <strong>Error:</strong> {executionResult.error}
                  </div>
                )}

                {executionResult.finalResult && (
                  <div>
                    <div className="font-medium mb-2">Final Result:</div>
                    <pre className="text-xs bg-muted p-3 rounded border overflow-x-auto max-h-40">
                      {JSON.stringify(executionResult.finalResult, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                  <span>Steps: {executionResult.steps.length}</span>
                  <span>
                    Completed: {executionResult.steps.filter(s => s.status === 'completed').length}
                  </span>
                  <span>
                    Failed: {executionResult.steps.filter(s => s.status === 'failed').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Execution Steps */}
          {executionResult && executionResult.steps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Execution Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {executionResult.steps.map((step, index) => {
                  const StatusIcon = statusIcons[step.status];
                  const isExpanded = expandedStep === step.nodeId;

                  return (
                    <div
                      key={step.nodeId}
                      className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedStep(isExpanded ? null : step.nodeId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </div>
                          <StatusIcon
                            className={cn(
                              "h-4 w-4",
                              statusColors[step.status],
                              step.status === "running" && "animate-spin"
                            )}
                          />
                          <div>
                            <div className="font-medium">
                              {step.data.name || step.data.type || "Unknown"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {step.nodeType} • {step.data.path || step.data.type}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <Badge
                            variant={
                              step.status === 'completed' ? 'default' :
                              step.status === 'failed' ? 'destructive' :
                              step.status === 'running' ? 'secondary' : 'outline'
                            }
                          >
                            {step.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {getStepDuration(step)}
                          </div>
                        </div>
                      </div>

                      {isExpanded && renderStepResult(step)}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!executionResult && !isExecuting && (
            <div className="text-center text-muted-foreground py-12">
              <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Ready to Execute</p>
              <p className="text-sm">
                Configure your flow and click Execute to run the API chain
              </p>
            </div>
          )}

          {/* Executing State */}
          {isExecuting && !executionResult && (
            <div className="text-center text-muted-foreground py-12">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
              <p className="text-lg font-medium">Executing Flow...</p>
              <p className="text-sm">
                Running your API chain, please wait
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
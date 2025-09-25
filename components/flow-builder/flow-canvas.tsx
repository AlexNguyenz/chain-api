"use client";

import React, { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  OnConnect,
  ReactFlowProvider,
  ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Play, Loader2 } from "lucide-react";

import { EndpointNode } from "./endpoint-node";
import { FlowControlNode } from "./flow-control-node";
import { RequestDetailsModal } from "./request-details-modal";
import { type Endpoint, useEndpointStore } from "@/store/endpoints";
import { useTemplateStore } from "@/store/templates";
import { Button } from "@/components/ui/button";
import { APIChainExecutor } from "@/lib/execution-engine";

const nodeTypes = {
  endpoint: EndpointNode,
  flowControl: FlowControlNode,
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeSelect: (nodeId: string | null, nodeData?: Endpoint | null) => void;
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onReactFlowInit?: (instance: ReactFlowInstance) => void;
  selectedTemplateId?: string;
}

export function FlowCanvas({
  nodes,
  edges,
  onNodeSelect,
  onNodesChange: onNodesChangeCallback,
  onEdgesChange: onEdgesChangeCallback,
  onReactFlowInit,
  selectedTemplateId,
}: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  // Use local state for React Flow operations (dragging, etc.)
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [selectedNodeForDetails, setSelectedNodeForDetails] =
    useState<Node | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Debounce timer for position saves
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to stores
  const endpoints = useEndpointStore((state) => state.endpoints);
  const { selectedTemplate, templates } = useTemplateStore();

  // Sync props to local state when template changes
  React.useEffect(() => {
    setLocalNodes(nodes);
    setLocalEdges(edges);
  }, [nodes, edges, setLocalNodes, setLocalEdges]);

  // Sync endpoint store changes with nodes
  React.useEffect(() => {
    setLocalNodes((currentNodes) => {
      const updatedNodes = currentNodes.map((node) => {
        // Check if this is an endpoint node
        if (node.type === "endpoint" && node.data.id) {
          // Find the updated endpoint data from store
          const updatedEndpoint = endpoints.find((ep) => ep.id === node.data.id);
          if (updatedEndpoint) {
            // Check if data actually changed
            const dataChanged =
              node.data.name !== updatedEndpoint.name ||
              node.data.path !== updatedEndpoint.path ||
              node.data.method !== updatedEndpoint.method ||
              node.data.description !== updatedEndpoint.description;

            if (dataChanged) {
              // Update node with latest endpoint data
              return {
                ...node,
                data: {
                  ...node.data,
                  ...updatedEndpoint,
                  // Preserve node-specific data like execution status
                  executionStatus: node.data.executionStatus,
                  requestData: node.data.requestData,
                  responseData: node.data.responseData,
                  onSelect: node.data.onSelect,
                },
              };
            }
          }
        }
        return node;
      });

      return updatedNodes;
    });
  }, [endpoints, setLocalNodes]);

  // Debounced save function
  const debouncedSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onNodesChangeCallback?.(localNodes);
      onEdgesChangeCallback?.(localEdges);
    }, 1000); // 1 second after user stops interacting
  }, [localNodes, localEdges, onNodesChangeCallback, onEdgesChangeCallback]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setLocalEdges((eds) => {
        const newEdges = addEdge(params, eds);
        // Trigger save after connect
        setTimeout(() => {
          onEdgesChangeCallback?.(newEdges);
        }, 200);
        return newEdges;
      });
    },
    [setLocalEdges, onEdgesChangeCallback]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // Check if template is selected before allowing drop
      if (!selectedTemplateId) {
        alert(
          "Please create or select a template first before adding endpoints to your flow."
        );
        return;
      }

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type || !reactFlowInstance) {
        return;
      }

      try {
        const dropData = JSON.parse(type);
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        if (dropData.type === "endpoint") {
          const nodeId = `${selectedTemplateId}-endpoint-${
            dropData.data.id
          }-${Date.now()}`;
          const newNode: Node = {
            id: nodeId,
            type: "endpoint",
            position,
            data: {
              ...dropData.data,
              id: dropData.data.id, // Ensure we keep the endpoint ID
              onSelect: () => onNodeSelect(nodeId),
            },
          };

          setLocalNodes((nds) => {
            const newNodes = nds.concat(newNode);
            // Trigger save after adding node
            setTimeout(() => {
              onNodesChangeCallback?.(newNodes);
            }, 200);
            return newNodes;
          });
        } else if (dropData.type === "flowControl") {
          const nodeId = `${selectedTemplateId}-flowControl-${
            dropData.data.id
          }-${Date.now()}`;
          const newNode: Node = {
            id: nodeId,
            type: "flowControl",
            position,
            data: {
              ...dropData.data,
              onSelect: () => onNodeSelect(nodeId),
            },
          };

          setLocalNodes((nds) => {
            const newNodes = nds.concat(newNode);
            // Trigger save after adding node
            setTimeout(() => {
              onNodesChangeCallback?.(newNodes);
            }, 200);
            return newNodes;
          });
        }
      } catch (error) {
        console.error("Error parsing drop data:", error);
      }
    },
    [reactFlowInstance, onNodeSelect, selectedTemplateId, onNodesChangeCallback]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id, node.data as unknown as Endpoint);

      // Nếu là endpoint node đã execute thì mở modal details
      if (
        node.type === "endpoint" &&
        (node.data.executionStatus === "success" ||
          node.data.executionStatus === "error")
      ) {
        setSelectedNodeForDetails(node);
      }
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null, null);
  }, [onNodeSelect]);

  const updateNodeStatus = useCallback(
    (nodeId: string, status: string) => {
      setLocalNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, executionStatus: status } }
            : node
        )
      );
    },
    [setLocalNodes]
  );

  const handleRunFlow = useCallback(async () => {
    if (localNodes.length === 0 || isExecuting) {
      return;
    }

    try {
      setIsExecuting(true);

      // Reset all nodes to idle state
      setLocalNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, executionStatus: "idle" },
        }))
      );

      // Get fresh template from store to ensure latest variables
      const freshTemplate = selectedTemplate ? templates.find(t => t.id === selectedTemplate.id) || selectedTemplate : undefined;


      const executor = new APIChainExecutor(localNodes, localEdges, freshTemplate);

      // Execute with real-time status callbacks
      await executor.executeWithCallbacks({
        onNodeStart: (nodeId) => updateNodeStatus(nodeId, "loading"),
        onNodeComplete: (nodeId, requestData, responseData) => {
          // Kiểm tra xem có error trong response không
          const hasError = responseData?.error || responseData?.status >= 400;

          setLocalNodes((nds) =>
            nds.map((node) =>
              node.id === nodeId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      executionStatus: hasError ? "error" : "success",
                      requestData,
                      responseData,
                    },
                  }
                : node
            )
          );
        },
        onNodeError: (nodeId) => updateNodeStatus(nodeId, "error"),
      });

      // Save execution results to template
      setTimeout(() => {
        debouncedSave();
      }, 500);

      // No alert needed, status is visible in UI
    } catch (error) {
      console.error("Flow execution error:", error);
      // Only log error, no alert needed
    } finally {
      setIsExecuting(false);
    }
  }, [localNodes, localEdges, updateNodeStatus, isExecuting, selectedTemplate, templates, debouncedSave]);

  const handleClearFlow = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) {
      return;
    }

    if (confirm("Are you sure you want to clear all nodes?")) {
      // Clear via callbacks
      onNodesChangeCallback?.([]);
      onEdgesChangeCallback?.([]);

      // Clear selection
      onNodeSelect(null, null);
    }
  }, [
    nodes.length,
    edges.length,
    onNodeSelect,
    onNodesChangeCallback,
    onEdgesChangeCallback,
  ]);

  return (
    <div className="h-full relative" ref={reactFlowWrapper}>
      {/* Flow Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={handleRunFlow}
          disabled={isExecuting}
          className="bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          {isExecuting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isExecuting ? "Executing..." : "Run Flow"}
        </Button>
        <Button
          onClick={handleClearFlow}
          disabled={isExecuting}
          variant="outline"
          className="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 text-black border px-4 py-2 rounded-md"
        >
          Clear
        </Button>
      </div>

      <ReactFlow
        key={selectedTemplateId || "no-template"}
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={(changes) => {
          onNodesChange(changes);
          // Check if position change ended (drag finished)
          if (changes.some(change => change.type === 'position' && !change.dragging)) {
            debouncedSave();
          }
        }}
        onEdgesChange={(changes) => {
          onEdgesChange(changes);
          // Save immediately for edge changes (connect/delete)
          if (changes.some(change => change.type === 'add' || change.type === 'remove')) {
            // Get fresh edges after changes
            setTimeout(() => {
              if (reactFlowInstance) {
                const freshEdges = reactFlowInstance.getEdges();
                onEdgesChangeCallback?.(freshEdges);
              }
            }, 200);
          }
        }}
        onConnect={onConnect}
        onInit={(instance) => {
          setReactFlowInstance(instance);
          onReactFlowInit?.(instance);
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>

      {/* Request Details Modal */}
      {selectedNodeForDetails && (
        <RequestDetailsModal
          isOpen={!!selectedNodeForDetails}
          onClose={() => setSelectedNodeForDetails(null)}
          nodeData={{
            method: selectedNodeForDetails.data.method as string,
            path: selectedNodeForDetails.data.path as string,
            name: selectedNodeForDetails.data.name as string,
            requestData: selectedNodeForDetails.data.requestData,
            responseData: selectedNodeForDetails.data.responseData,
          }}
        />
      )}
    </div>
  );
}

export function FlowCanvasWrapper(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
}

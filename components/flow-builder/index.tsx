"use client";

import { useState, useEffect } from "react";
import { Node, Edge } from "@xyflow/react";
import { Header } from "./header";
import { EndpointList } from "./endpoint-list";
import { FlowControlList } from "./flow-control-list";
import { TemplatesTab } from "@/components/templates/templates-tab";
import { FlowCanvasWrapper } from "./flow-canvas";
import { ConfigPanel } from "./config-panel";
import { FlowExecutor } from "./flow-executor";
import { type Endpoint } from "@/store/endpoints";
import { useTemplateStore } from "@/store/templates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FlowBuilder() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<Endpoint | null>(
    null
  );
  const [editEndpoint, setEditEndpoint] = useState<Endpoint | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const { selectedTemplate, updateTemplateFlow } = useTemplateStore();

  const handleNodeSelect = (
    nodeId: string | null,
    nodeData?: Endpoint | null
  ) => {
    setSelectedNode(nodeId);
    setSelectedNodeData(nodeData || null);
  };

  // Load template data when selected template ID changes
  useEffect(() => {
    // Only clear selected nodes when template ID actually changes
    setSelectedNode(null);
    setSelectedNodeData(null);

    if (selectedTemplate) {
      // Load template data
      setNodes(selectedTemplate.nodes || []);
      setEdges(selectedTemplate.edges || []);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [selectedTemplate?.id]); // Only when template ID changes, not updatedAt

  // Separate effect to update nodes/edges when template content changes (but keep selection)
  useEffect(() => {
    if (selectedTemplate && nodes.length > 0) {
      setNodes(selectedTemplate.nodes || []);
      setEdges(selectedTemplate.edges || []);
    }
  }, [selectedTemplate?.updatedAt]); // When content changes, update but don't clear selection

  const handleNodesChange = (newNodes: Node[]) => {
    setNodes(newNodes);
  };

  const handleEdgesChange = (newEdges: Edge[]) => {
    setEdges(newEdges);
  };

  // Auto-save to template when nodes or edges change (debounced)
  useEffect(() => {
    // Skip if no template
    if (!selectedTemplate) return;

    const timeoutId = setTimeout(() => {
      updateTemplateFlow(selectedTemplate.id, nodes, edges);
    }, 3000); // 3 seconds debounce

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, selectedTemplate?.id, updateTemplateFlow]); // Include all deps

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0">
        <Header
          editEndpoint={editEndpoint}
          onEditEndpointChange={setEditEndpoint}
        />
      </div>

      {/* Main Content - Remaining height */}
      <div className="flex flex-1 min-h-0">
        {/* Cột 1: Tabs (Endpoints, Flow Controls, Templates) - 20% */}
        <div className="w-1/5 bg-background border-r flex flex-col">
          <Tabs defaultValue="endpoints" className="h-full flex flex-col">
            <div className="p-4 pb-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="endpoints" className="text-xs">
                  Endpoints
                </TabsTrigger>
                <TabsTrigger value="utilities" className="text-xs">
                  Utilities
                </TabsTrigger>
                <TabsTrigger value="templates" className="text-xs">
                  Templates
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="endpoints" className="flex-1 mt-0 h-0">
              <EndpointList onEditEndpoint={setEditEndpoint} />
            </TabsContent>
            <TabsContent value="utilities" className="flex-1 mt-0 h-0">
              <FlowControlList />
            </TabsContent>
            <TabsContent value="templates" className="flex-1 mt-0 h-0">
              <TemplatesTab />
            </TabsContent>
          </Tabs>
        </div>

        {/* Cột 2: React Flow Canvas - 50% */}
        <div className="w-1/2 bg-muted/30 flex flex-col">
          <FlowCanvasWrapper
            nodes={nodes}
            edges={edges}
            onNodeSelect={handleNodeSelect}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onReactFlowInit={() => {}}
            selectedTemplateId={selectedTemplate?.id}
          />
        </div>

        {/* Cột 3: Config Panel - 30% */}
        <div className="w-[30%] bg-background border-l flex flex-col">
          <ConfigPanel
            selectedNode={selectedNode}
            selectedNodeData={selectedNodeData}
          />
        </div>
      </div>
    </div>
  );
}

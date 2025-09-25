"use client";

import { useState } from "react";
import { Node, Edge } from "@xyflow/react";
import { Header } from "./header";
import { EndpointList } from "./endpoint-list";
import { FlowControlList } from "./flow-control-list";
import { TemplateList } from "./template-list";
import { FlowCanvasWrapper } from "./flow-canvas";
import { ConfigPanel } from "./config-panel";
import { FlowExecutor } from "./flow-executor";
import { type Endpoint } from "@/store/endpoints";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FlowBuilder() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<Endpoint | null>(
    null
  );
  const [editEndpoint, setEditEndpoint] = useState<Endpoint | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleNodeSelect = (
    nodeId: string | null,
    nodeData?: Endpoint | null
  ) => {
    setSelectedNode(nodeId);
    setSelectedNodeData(nodeData || null);
  };

  const handleNodesChange = (newNodes: Node[]) => {
    setNodes(newNodes);
  };

  const handleEdgesChange = (newEdges: Edge[]) => {
    setEdges(newEdges);
  };

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
              <TemplateList />
            </TabsContent>
          </Tabs>
        </div>

        {/* Cột 2: React Flow Canvas - 50% */}
        <div className="w-1/2 bg-muted/30 flex flex-col">
          <FlowCanvasWrapper
            onNodeSelect={handleNodeSelect}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
          />
        </div>

        {/* Cột 3: Config & Execution Panel - 30% */}
        <div className="w-[30%] bg-background border-l flex flex-col">
          <Tabs defaultValue="config" className="h-full flex flex-col">
            <div className="p-4 pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="config" className="text-xs">Config</TabsTrigger>
                <TabsTrigger value="execute" className="text-xs">Execute</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="config" className="flex-1 mt-0 h-0">
              <ConfigPanel
                selectedNode={selectedNode}
                selectedNodeData={selectedNodeData}
              />
            </TabsContent>
            <TabsContent value="execute" className="flex-1 mt-0 h-0">
              <FlowExecutor nodes={nodes} edges={edges} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

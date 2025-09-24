'use client'

import { useState } from 'react'
import { Header } from './header'
import { EndpointList } from './endpoint-list'
import { FlowCanvasWrapper } from './flow-canvas'
import { ConfigPanel } from './config-panel'
import { type Endpoint } from '@/store/endpoints'

export function FlowBuilder() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null)
  const [editEndpoint, setEditEndpoint] = useState<Endpoint | null>(null)

  const handleNodeSelect = (nodeId: string | null, nodeData?: any) => {
    setSelectedNode(nodeId)
    setSelectedNodeData(nodeData || null)
  }

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
        {/* Cột 1: Danh sách Endpoint - 20% */}
        <div className="w-1/5 bg-background border-r flex flex-col">
          <EndpointList onEditEndpoint={setEditEndpoint} />
        </div>

        {/* Cột 2: React Flow Canvas - 50% */}
        <div className="w-1/2 bg-muted/30 flex flex-col">
          <FlowCanvasWrapper
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        {/* Cột 3: Config Panel - 30% */}
        <div className="w-[30%] bg-background border-l flex flex-col">
          <ConfigPanel selectedNode={selectedNode} selectedNodeData={selectedNodeData} />
        </div>
      </div>
    </div>
  )
}
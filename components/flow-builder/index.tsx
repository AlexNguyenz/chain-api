'use client'

import { useState } from 'react'
import { Header } from './header'
import { EndpointList } from './endpoint-list'
import { FlowCanvasWrapper } from './flow-canvas'
import { ConfigPanel } from './config-panel'

export function FlowBuilder() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0">
        <Header />
      </div>

      {/* Main Content - Remaining height */}
      <div className="flex flex-1 min-h-0">
        {/* Cột 1: Danh sách Endpoint - 20% */}
        <div className="w-1/5 bg-white border-r border-gray-200 flex flex-col">
          <EndpointList />
        </div>

        {/* Cột 2: React Flow Canvas - 50% */}
        <div className="w-1/2 bg-gray-100 flex flex-col">
          <FlowCanvasWrapper
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
          />
        </div>

        {/* Cột 3: Config Panel - 30% */}
        <div className="w-[30%] bg-white border-l border-gray-200 flex flex-col">
          <ConfigPanel selectedNode={selectedNode} />
        </div>
      </div>
    </div>
  )
}
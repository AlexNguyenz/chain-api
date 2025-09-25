'use client'

import React, { useCallback, useState, useRef } from 'react'
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
  ReactFlowInstance
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Play } from 'lucide-react'

import { EndpointNode } from './endpoint-node'
import { FlowControlNode } from './flow-control-node'
import { type Endpoint } from '@/store/endpoints'
import { Button } from '@/components/ui/button'
import { APIChainExecutor } from '@/lib/execution-engine'

const nodeTypes = {
  endpoint: EndpointNode,
  flowControl: FlowControlNode,
}

interface FlowCanvasProps {
  onNodeSelect: (nodeId: string | null, nodeData?: Endpoint | null) => void
  onNodesChange?: (nodes: Node[]) => void
  onEdgesChange?: (edges: Edge[]) => void
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export function FlowCanvas({ onNodeSelect, onNodesChange: onNodesChangeCallback, onEdgesChange: onEdgesChangeCallback }: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  // Sync nodes and edges with parent component
  React.useEffect(() => {
    if (onNodesChangeCallback) {
      onNodesChangeCallback(nodes);
    }
  }, [nodes, onNodesChangeCallback]);

  React.useEffect(() => {
    if (onEdgesChangeCallback) {
      onEdgesChangeCallback(edges);
    }
  }, [edges, onEdgesChangeCallback]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return
      }

      try {
        const dropData = JSON.parse(type)
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })

        if (dropData.type === 'endpoint') {
          const nodeId = `endpoint-${dropData.data.id}-${Date.now()}`
          const newNode: Node = {
            id: nodeId,
            type: 'endpoint',
            position,
            data: {
              ...dropData.data,
              onSelect: () => onNodeSelect(nodeId)
            },
          }

          setNodes((nds) => nds.concat(newNode))
        } else if (dropData.type === 'flowControl') {
          const nodeId = `flowControl-${dropData.data.id}-${Date.now()}`
          const newNode: Node = {
            id: nodeId,
            type: 'flowControl',
            position,
            data: {
              ...dropData.data,
              onSelect: () => onNodeSelect(nodeId)
            },
          }

          setNodes((nds) => nds.concat(newNode))
        }
      } catch (error) {
        console.error('Error parsing drop data:', error)
      }
    },
    [reactFlowInstance, setNodes, onNodeSelect]
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id, node.data as unknown as Endpoint)
    },
    [onNodeSelect]
  )

  const onPaneClick = useCallback(() => {
    onNodeSelect(null, null)
  }, [onNodeSelect])

  const updateNodeStatus = useCallback((nodeId: string, status: string) => {
    console.log(`Updating node ${nodeId} to status: ${status}`);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, executionStatus: status } }
          : node
      )
    )
  }, [setNodes])

  const handleRunFlow = useCallback(async () => {
    if (nodes.length === 0) {
      return
    }

    try {
      // Reset all nodes to idle state
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, executionStatus: 'idle' }
        }))
      )

      const executor = new APIChainExecutor(nodes, edges)

      // Execute with real-time status callbacks
      await executor.executeWithCallbacks({
        onNodeStart: (nodeId) => updateNodeStatus(nodeId, 'loading'),
        onNodeComplete: (nodeId) => updateNodeStatus(nodeId, 'success'),
        onNodeError: (nodeId) => updateNodeStatus(nodeId, 'error')
      })

      // No alert needed, status is visible in UI
    } catch (error) {
      console.error('Flow execution error:', error)
      // Only log error, no alert needed
    }
  }, [nodes, edges, setNodes, updateNodeStatus])

  const handleClearFlow = useCallback(() => {
    if (nodes.length === 0 && edges.length === 0) {
      return
    }

    if (confirm('Are you sure you want to clear all nodes?')) {
      setNodes([])
      setEdges([])
      onNodeSelect(null, null)
    }
  }, [nodes.length, edges.length, setNodes, setEdges, onNodeSelect])

  return (
    <div className="h-full relative" ref={reactFlowWrapper}>
      {/* Flow Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={handleRunFlow}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Run Flow
        </Button>
        <Button
          onClick={handleClearFlow}
          variant="outline"
          className="bg-white hover:bg-gray-50 text-black border px-4 py-2 rounded-md"
        >
          Clear
        </Button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
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
    </div>
  )
}

export function FlowCanvasWrapper(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  )
}